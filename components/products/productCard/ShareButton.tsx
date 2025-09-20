import React from 'react';
import { Pressable, Share, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { Icon } from '@/components/ui/icon';
import { Share2 } from 'lucide-react-native';
import { Product } from './types';

interface ShareButtonProps {
  product: Product;
}

function guessMimeType(path: string): string | undefined {
  const lower = path.split('?')[0].toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return undefined;
}

export default function ShareButton({ product }: ShareButtonProps) {
  const handleShare = async (e?: any) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    // Build deep link to product page in the app using Expo Router paths
    const deepLink = Linking.createURL(`/product/${product.id}`);

    const lines = [
      `Check out this product: ${product.name}`,
      product.description ? product.description : undefined,
      product.price != null ? `Price: $${product.price}` : undefined,
      // Include image URL in message for clients that parse it
      product.image ? `Image: ${product.image}` : undefined,
      // Always include the app deep link
      `Open in app: ${deepLink}`,
    ].filter(Boolean) as string[];

    const message = lines.join('\n');

    // Try to share the actual image file when possible (best experience)
    try {
      let detectedMime: string | undefined;
      if (product.image) {
        const sharingModule: any = await import('expo-sharing');
        const fsModule: any = await import('expo-file-system');

        if (await sharingModule.isAvailableAsync()) {
          let localUri = product.image as string;

          // Download remote image to a local file before sharing
          if (localUri.startsWith('http')) {
            const filename = localUri.split('/').pop()?.split('?')[0] || `image-${product.id}.jpg`;
            const fileUri = `${fsModule.cacheDirectory}${filename}`;
            try {
              const res = await fsModule.downloadAsync(localUri, fileUri);
              localUri = res.uri;
              detectedMime = (res.headers && (res.headers['Content-Type'] || res.headers['content-type'])) || undefined;
            } catch (downloadErr) {
              console.warn('Failed to download image, falling back to message share:', downloadErr);
            }
          }

          // Convert to JPEG and normalize size to improve compatibility (e.g., WhatsApp)
          try {
            const ImageManipulator: any = await import('expo-image-manipulator');
            const manipulated = await ImageManipulator.manipulateAsync(
              localUri,
              [{ resize: { width: 1200 } }],
              { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            localUri = manipulated.uri;
            detectedMime = 'image/jpeg';
          } catch (convErr) {
            console.warn('Unable to convert image to JPEG:', convErr);
          }

          // Share the image file
          if (localUri.startsWith('file:')) {
            if (Platform.OS === 'ios') {
              // On iOS, Share API supports a file URL and may include message text
              await Share.share({
                url: localUri,
                message: `Open in app: ${deepLink}`,
                subject: product.name,
              });
            } else {
              // On Android, share the image file; some apps won't accept extra text
              await sharingModule.shareAsync(localUri, {
                dialogTitle: product.name,
                mimeType: detectedMime || guessMimeType(localUri) || 'image/*',
              });
            }
            return; // Image shared, end here
          }
        }
      }
    } catch (err) {
      // Likely expo-sharing or expo-file-system not installed or not available on this platform
      console.warn('Image share not available, using text share:', err);
    }

    // Fallback: Share a message that contains both the image URL and the deep link
    try {
      const payload: any = Platform.select({
        ios: { message, url: deepLink, subject: product.name },
        android: { message, subject: product.name },
        default: { message },
      });

      await Share.share(payload);
    } catch (shareErr) {
      console.warn('Failed to share content:', shareErr);
    }
  };

  return (
    <Pressable
      onPress={handleShare}
      className="w-8 h-8 bg-background-0/90 rounded-full items-center justify-center border border-outline-200 active:scale-95"
      accessibilityRole="button"
      accessibilityLabel={`Share ${product.name}`}
    >
      <Icon as={Share2} size="xs" className="text-typography-700" />
    </Pressable>
  );
}
