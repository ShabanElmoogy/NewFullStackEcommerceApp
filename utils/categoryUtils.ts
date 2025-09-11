import { Category, SubCategory } from '@/api/categories';
import {
  Shirt,
  Smartphone,
  Home as HomeIcon,
  Gamepad2,
  Book,
  Car,
  Package,
  ShoppingBag,
  Laptop,
  Watch,
  Headphones,
  Camera,
  Dumbbell,
  Baby,
  PawPrint,
  Utensils,
  Palette,
  Wrench,
  Flower,
  Gift,
} from 'lucide-react-native';

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
  // Fashion & Clothing
  'fashion': Shirt,
  'clothing': Shirt,
  'apparel': Shirt,
  'clothes': Shirt,
  
  // Electronics
  'electronics': Smartphone,
  'electronic': Smartphone,
  'tech': Smartphone,
  'technology': Smartphone,
  'gadgets': Smartphone,
  
  // Home & Garden
  'home': HomeIcon,
  'garden': HomeIcon,
  'furniture': HomeIcon,
  'decor': HomeIcon,
  'household': HomeIcon,
  
  // Gaming
  'gaming': Gamepad2,
  'games': Gamepad2,
  'console': Gamepad2,
  
  // Books
  'books': Book,
  'book': Book,
  'literature': Book,
  'education': Book,
  
  // Automotive
  'automotive': Car,
  'auto': Car,
  'car': Car,
  'vehicle': Car,
  
  // Computers
  'computers': Laptop,
  'computer': Laptop,
  'laptop': Laptop,
  'pc': Laptop,
  
  // Watches
  'watches': Watch,
  'watch': Watch,
  'timepiece': Watch,
  
  // Audio
  'audio': Headphones,
  'headphones': Headphones,
  'speakers': Headphones,
  'music': Headphones,
  
  // Photography
  'photography': Camera,
  'camera': Camera,
  'photo': Camera,
  
  // Sports & Fitness
  'sports': Dumbbell,
  'fitness': Dumbbell,
  'exercise': Dumbbell,
  'gym': Dumbbell,
  
  // Baby & Kids
  'baby': Baby,
  'kids': Baby,
  'children': Baby,
  'toys': Baby,
  
  // Pets
  'pets': PawPrint,
  'pet': PawPrint,
  'animals': PawPrint,
  
  // Food & Beverages
  'food': Utensils,
  'beverages': Utensils,
  'grocery': Utensils,
  'kitchen': Utensils,
  
  // Art & Crafts
  'art': Palette,
  'crafts': Palette,
  'creative': Palette,
  'hobby': Palette,
  
  // Tools & Hardware
  'tools': Wrench,
  'hardware': Wrench,
  'diy': Wrench,
  
  // Beauty & Personal Care
  'beauty': Flower,
  'cosmetics': Flower,
  'skincare': Flower,
  'personal': Flower,
  
  // Default
  'default': Package,
};

// Color themes for categories
const categoryColors = [
  { bg: 'bg-coral-coral-light', border: 'border-coral-rose', icon: 'text-coral-rose', text: 'text-coral-rose-dark' },
  { bg: 'bg-ocean-sky-tint', border: 'border-ocean-cyan', icon: 'text-ocean-cyan', text: 'text-ocean-deep' },
  { bg: 'bg-forest-green-tint', border: 'border-forest-green', icon: 'text-forest-green', text: 'text-forest-green-darkest' },
  { bg: 'bg-vibrant-ice-blue', border: 'border-vibrant-blue', icon: 'text-vibrant-blue', text: 'text-vibrant-navy' },
  { bg: 'bg-peach-peach-tint', border: 'border-peach-orange', icon: 'text-peach-orange', text: 'text-peach-brown' },
  { bg: 'bg-lavender-purple-tint', border: 'border-lavender-purple', icon: 'text-lavender-purple', text: 'text-lavender-purple-darkest' },
  { bg: 'bg-sunset-orange-light', border: 'border-sunset-orange', icon: 'text-sunset-orange', text: 'text-sunset-brown' },
  { bg: 'bg-mint-green-tint', border: 'border-mint-green', icon: 'text-mint-green', text: 'text-mint-green-darkest' },
];

// Get icon for category based on name
export function getCategoryIcon(categoryName: string): any {
  const normalizedName = categoryName.toLowerCase().trim();
  
  // Try to find exact match first
  if (categoryIcons[normalizedName]) {
    return categoryIcons[normalizedName];
  }
  
  // Try to find partial match
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return icon;
    }
  }
  
  return categoryIcons.default;
}

// Get color theme for category
export function getCategoryColor(index: number) {
  return categoryColors[index % categoryColors.length];
}

// Get display name based on locale
export function getCategoryDisplayName(category: Category | SubCategory, locale: 'en' | 'ar' = 'en'): string {
  return locale === 'ar' ? category.nameAr : category.nameEn;
}

// Transform API categories to display format
export function transformCategoriesToDisplay(categories: Category[], locale: 'en' | 'ar' = 'en') {
  return categories
    .filter(category => !category.isDeleted)
    .map((category, index) => {
      const displayName = getCategoryDisplayName(category, locale);
      const icon = getCategoryIcon(displayName);
      const colors = getCategoryColor(index);
      
      return {
        id: category.id,
        name: displayName,
        nameAr: category.nameAr,
        nameEn: category.nameEn,
        icon,
        themeClass: `${colors.bg} ${colors.border}`,
        iconClass: colors.icon,
        textClass: colors.text,
        subCategories: category.subCategories?.filter(sub => !sub.isDeleted) || [],
        originalData: category,
      };
    });
}

// Transform subcategories to display format
export function transformSubCategoriesToDisplay(subCategories: SubCategory[], locale: 'en' | 'ar' = 'en') {
  return subCategories
    .filter(subCategory => !subCategory.isDeleted)
    .map((subCategory, index) => {
      const displayName = getCategoryDisplayName(subCategory, locale);
      const icon = getCategoryIcon(displayName);
      const colors = getCategoryColor(index);
      
      return {
        id: subCategory.id,
        name: displayName,
        nameAr: subCategory.nameAr,
        nameEn: subCategory.nameEn,
        icon,
        themeClass: `${colors.bg} ${colors.border}`,
        iconClass: colors.icon,
        textClass: colors.text,
        categories: subCategory.categories?.filter(cat => !cat.isDeleted) || [],
        originalData: subCategory,
      };
    });
}

// Get categories for filter options
export function getCategoriesForFilter(categories: Category[], locale: 'en' | 'ar' = 'en') {
  return categories
    .filter(category => !category.isDeleted)
    .map((category, index) => {
      const displayName = getCategoryDisplayName(category, locale);
      const icon = getCategoryIcon(displayName);
      const colors = getCategoryColor(index);
      
      return {
        value: category.id.toString(),
        label: displayName,
        icon,
        color: colors.icon.replace('text-', '#'), // Convert to hex color if needed
        originalData: category,
      };
    });
}

// Get subcategories for filter options
export function getSubCategoriesForFilter(subCategories: SubCategory[], locale: 'en' | 'ar' = 'en') {
  return subCategories
    .filter(subCategory => !subCategory.isDeleted)
    .map((subCategory, index) => {
      const displayName = getCategoryDisplayName(subCategory, locale);
      const icon = getCategoryIcon(displayName);
      const colors = getCategoryColor(index);
      
      return {
        value: subCategory.id.toString(),
        label: displayName,
        icon,
        color: colors.icon.replace('text-', '#'), // Convert to hex color if needed
        originalData: subCategory,
      };
    });
}