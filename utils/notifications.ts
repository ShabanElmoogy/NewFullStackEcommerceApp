import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let initialized = false;

export function isExpoGo(): boolean {
  const ownership: any = (Constants as any).appOwnership; // 'expo' | 'standalone' | 'guest'
  const execEnv: any = (Constants as any).executionEnvironment; // 'storeClient' in Expo Go
  return ownership === 'expo' || execEnv === 'storeClient';
}

export function canUseRemotePush(): boolean {
  return !isExpoGo();
}

export async function initializeNotifications(): Promise<void> {
  if (initialized) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: undefined,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  initialized = true;
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!canUseRemotePush()) {
    // Remote push not supported in Expo Go (SDK 53+)
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }

  const anyConstants: any = Constants as any;
  const projectId: string | undefined =
    anyConstants?.expoConfig?.extra?.eas?.projectId ??
    anyConstants?.easConfig?.projectId ??
    process.env.EXPO_PROJECT_ID ??
    undefined;

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId } as any);
  return tokenData?.data ?? null;
}

export function addNotificationListeners(
  onReceive?: (notification: Notifications.Notification) => void,
  onResponse?: (response: Notifications.NotificationResponse) => void
): () => void {
  const subs: Array<{ remove: () => void }> = [];

  if (onReceive) {
    const sub = Notifications.addNotificationReceivedListener(onReceive);
    subs.push(sub);
  }
  if (onResponse) {
    const sub = Notifications.addNotificationResponseReceivedListener(onResponse);
    subs.push(sub);
  }

  return () => {
    subs.forEach((s) => {
      try {
        s.remove();
      } catch {}
    });
  };
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: any,
  seconds: number = 1
) {
  await initializeNotifications();
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: { seconds },
  });
}
