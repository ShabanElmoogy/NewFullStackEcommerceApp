import { 
  Smartphone, 
  Shirt, 
  Home, 
  Dumbbell, 
  Book, 
  Gamepad2,
  Sparkles,
  Laptop,
  Watch,
  Headphones,
  Camera,
  Monitor,
  Tablet,
  Speaker,
  Zap,
  Car,
  Bike,
  Baby,
  Heart,
  Stethoscope,
  Pill,
  Activity,
  Palette,
  Gem,
  Crown,
  ShoppingBag,
  Backpack,
  Luggage,
  Footprints,
  Coffee,
  ChefHat,
  Flower,
  Wrench,
  Apple,
  TreePine,
  Target,
  GraduationCap,
  Pen,
  Music,
  Tv,
  Film,
  Gamepad
} from 'lucide-react-native';

// Theme color keys that will be resolved at runtime
export type ThemeColorKey = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'purple'
  | 'pink'
  | 'indigo'
  | 'cyan'
  | 'teal'
  | 'lime'
  | 'orange'
  | 'rose'
  | 'violet'
  | 'emerald'
  | 'sky'
  | 'amber'
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'gray';

export interface CategoryConfig {
  icon: any; // Lucide icon component
  colorKey: ThemeColorKey;
  fallbackColor: {
    light: string;
    dark: string;
  };
}

// Generic category configuration mapping
export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  // Electronics & Technology
  'mobiles': { 
    icon: Smartphone, 
    colorKey: 'blue',
    fallbackColor: { light: '#2563EB', dark: '#3B82F6' }
  },
  'smartphones': { 
    icon: Smartphone, 
    colorKey: 'primary',
    fallbackColor: { light: '#1D4ED8', dark: '#60A5FA' }
  },
  'phones': { 
    icon: Smartphone, 
    colorKey: 'indigo',
    fallbackColor: { light: '#1E40AF', dark: '#93C5FD' }
  },
  'electronics': { 
    icon: Zap, 
    colorKey: 'cyan',
    fallbackColor: { light: '#0EA5E9', dark: '#38BDF8' }
  },
  'laptops': { 
    icon: Laptop, 
    colorKey: 'purple',
    fallbackColor: { light: '#7C3AED', dark: '#A78BFA' }
  },
  'computers': { 
    icon: Monitor, 
    colorKey: 'indigo',
    fallbackColor: { light: '#4F46E5', dark: '#818CF8' }
  },
  'tablets': { 
    icon: Tablet, 
    colorKey: 'violet',
    fallbackColor: { light: '#6366F1', dark: '#A5B4FC' }
  },
  'watches': { 
    icon: Watch, 
    colorKey: 'emerald',
    fallbackColor: { light: '#059669', dark: '#34D399' }
  },
  'headphones': { 
    icon: Headphones, 
    colorKey: 'red',
    fallbackColor: { light: '#DC2626', dark: '#F87171' }
  },
  'audio': { 
    icon: Speaker, 
    colorKey: 'orange',
    fallbackColor: { light: '#EA580C', dark: '#FB923C' }
  },
  'cameras': { 
    icon: Camera, 
    colorKey: 'sky',
    fallbackColor: { light: '#0891B2', dark: '#22D3EE' }
  },
  'gaming': { 
    icon: Gamepad2, 
    colorKey: 'error',
    fallbackColor: { light: '#EF4444', dark: '#F87171' }
  },
  'games': { 
    icon: Gamepad, 
    colorKey: 'red',
    fallbackColor: { light: '#B91C1C', dark: '#EF4444' }
  },
  
  // Fashion & Accessories
  'fashion': { 
    icon: Shirt, 
    colorKey: 'pink',
    fallbackColor: { light: '#EC4899', dark: '#F472B6' }
  },
  'clothing': { 
    icon: Shirt, 
    colorKey: 'rose',
    fallbackColor: { light: '#DB2777', dark: '#F472B6' }
  },
  'apparel': { 
    icon: Shirt, 
    colorKey: 'pink',
    fallbackColor: { light: '#BE185D', dark: '#EC4899' }
  },
  'shoes': { 
    icon: Footprints, 
    colorKey: 'amber',
    fallbackColor: { light: '#A16207', dark: '#D97706' }
  },
  'footwear': { 
    icon: Footprints, 
    colorKey: 'yellow',
    fallbackColor: { light: '#92400E', dark: '#F59E0B' }
  },
  'bags': { 
    icon: ShoppingBag, 
    colorKey: 'green',
    fallbackColor: { light: '#059669', dark: '#10B981' }
  },
  'backpacks': { 
    icon: Backpack, 
    colorKey: 'sky',
    fallbackColor: { light: '#0369A1', dark: '#0EA5E9' }
  },
  'luggage': { 
    icon: Luggage, 
    colorKey: 'orange',
    fallbackColor: { light: '#7C2D12', dark: '#EA580C' }
  },
  'accessories': { 
    icon: Gem, 
    colorKey: 'purple',
    fallbackColor: { light: '#9333EA', dark: '#A855F7' }
  },
  'jewelry': { 
    icon: Crown, 
    colorKey: 'amber',
    fallbackColor: { light: '#D97706', dark: '#FBBF24' }
  },
  
  // Home & Living
  'home': { 
    icon: Home, 
    colorKey: 'green',
    fallbackColor: { light: '#16A34A', dark: '#22C55E' }
  },
  'furniture': { 
    icon: Home, 
    colorKey: 'emerald',
    fallbackColor: { light: '#15803D', dark: '#22C55E' }
  },
  'kitchen': { 
    icon: ChefHat, 
    colorKey: 'red',
    fallbackColor: { light: '#DC2626', dark: '#EF4444' }
  },
  'appliances': { 
    icon: Zap, 
    colorKey: 'info',
    fallbackColor: { light: '#0284C7', dark: '#0EA5E9' }
  },
  'garden': { 
    icon: Flower, 
    colorKey: 'lime',
    fallbackColor: { light: '#65A30D', dark: '#84CC16' }
  },
  'tools': { 
    icon: Wrench, 
    colorKey: 'gray',
    fallbackColor: { light: '#6B7280', dark: '#9CA3AF' }
  },
  
  // Health & Beauty
  'beauty': { 
    icon: Sparkles, 
    colorKey: 'orange',
    fallbackColor: { light: '#F97316', dark: '#FB923C' }
  },
  'cosmetics': { 
    icon: Palette, 
    colorKey: 'rose',
    fallbackColor: { light: '#E11D48', dark: '#FB7185' }
  },
  'skincare': { 
    icon: Heart, 
    colorKey: 'pink',
    fallbackColor: { light: '#F43F5E', dark: '#FB7185' }
  },
  'health': { 
    icon: Stethoscope, 
    colorKey: 'teal',
    fallbackColor: { light: '#0D9488', dark: '#14B8A6' }
  },
  'fitness': { 
    icon: Activity, 
    colorKey: 'error',
    fallbackColor: { light: '#DC2626', dark: '#EF4444' }
  },
  'medical': { 
    icon: Pill, 
    colorKey: 'cyan',
    fallbackColor: { light: '#0891B2', dark: '#06B6D4' }
  },
  
  // Sports & Recreation
  'sports': { 
    icon: Dumbbell, 
    colorKey: 'warning',
    fallbackColor: { light: '#EA580C', dark: '#FB923C' }
  },
  'outdoor': { 
    icon: TreePine, 
    colorKey: 'success',
    fallbackColor: { light: '#166534', dark: '#22C55E' }
  },
  'recreation': { 
    icon: Target, 
    colorKey: 'purple',
    fallbackColor: { light: '#7C3AED', dark: '#8B5CF6' }
  },
  
  // Food & Beverages
  'food': { 
    icon: Apple, 
    colorKey: 'red',
    fallbackColor: { light: '#DC2626', dark: '#EF4444' }
  },
  'beverages': { 
    icon: Coffee, 
    colorKey: 'amber',
    fallbackColor: { light: '#92400E', dark: '#D97706' }
  },
  'grocery': { 
    icon: ShoppingBag, 
    colorKey: 'green',
    fallbackColor: { light: '#16A34A', dark: '#22C55E' }
  },
  
  // Books & Education
  'books': { 
    icon: Book, 
    colorKey: 'violet',
    fallbackColor: { light: '#7C3AED', dark: '#A78BFA' }
  },
  'education': { 
    icon: GraduationCap, 
    colorKey: 'blue',
    fallbackColor: { light: '#1E40AF', dark: '#3B82F6' }
  },
  'stationery': { 
    icon: Pen, 
    colorKey: 'indigo',
    fallbackColor: { light: '#4338CA', dark: '#6366F1' }
  },
  
  // Automotive
  'automotive': { 
    icon: Car, 
    colorKey: 'gray',
    fallbackColor: { light: '#374151', dark: '#6B7280' }
  },
  'cars': { 
    icon: Car, 
    colorKey: 'gray',
    fallbackColor: { light: '#1F2937', dark: '#9CA3AF' }
  },
  'motorcycles': { 
    icon: Bike, 
    colorKey: 'red',
    fallbackColor: { light: '#B91C1C', dark: '#EF4444' }
  },
  
  // Baby & Kids
  'baby': { 
    icon: Baby, 
    colorKey: 'pink',
    fallbackColor: { light: '#F472B6', dark: '#EC4899' }
  },
  'kids': { 
    icon: Baby, 
    colorKey: 'cyan',
    fallbackColor: { light: '#06B6D4', dark: '#22D3EE' }
  },
  'toys': { 
    icon: Gamepad, 
    colorKey: 'yellow',
    fallbackColor: { light: '#F59E0B', dark: '#FBBF24' }
  },
  
  // Music & Entertainment
  'music': { 
    icon: Music, 
    colorKey: 'purple',
    fallbackColor: { light: '#8B5CF6', dark: '#A78BFA' }
  },
  'entertainment': { 
    icon: Tv, 
    colorKey: 'gray',
    fallbackColor: { light: '#4B5563', dark: '#6B7280' }
  },
  'movies': { 
    icon: Film, 
    colorKey: 'red',
    fallbackColor: { light: '#DC2626', dark: '#EF4444' }
  },
};

// Default configuration for unknown categories
export const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  icon: Sparkles,
  colorKey: 'primary',
  fallbackColor: { light: '#6366F1', dark: '#818CF8' }
};

/**
 * Get category configuration with theme colors
 * @param categoryName - The category name to look up
 * @param colors - Theme colors object
 * @param isDark - Whether dark theme is active
 * @returns Category configuration with resolved colors
 */
export function getCategoryConfig(
  categoryName: string, 
  colors: any, 
  isDark: boolean
) {
  // Normalize category name for lookup
  const normalizedName = categoryName.toLowerCase().trim();
  
  // Find the best matching configuration
  let bestMatch = DEFAULT_CATEGORY_CONFIG;
  let maxMatchLength = 0;

  // Look for exact matches first, then partial matches
  for (const [key, config] of Object.entries(CATEGORY_CONFIGS)) {
    if (normalizedName === key) {
      bestMatch = config;
      break;
    } else if (normalizedName.includes(key) || key.includes(normalizedName)) {
      if (key.length > maxMatchLength) {
        maxMatchLength = key.length;
        bestMatch = config;
      }
    }
  }

  // Resolve theme color or use fallback
  const themeColor = colors[bestMatch.colorKey];
  const resolvedColor = themeColor || bestMatch.fallbackColor[isDark ? 'dark' : 'light'];
  
  return {
    icon: bestMatch.icon,
    color: resolvedColor,
    lightColor: resolvedColor + '20', // Add 20% opacity for background
    colorKey: bestMatch.colorKey,
  };
}

/**
 * Get all category configurations for a list of categories
 * @param categories - Array of category objects
 * @param colors - Theme colors object
 * @param isDark - Whether dark theme is active
 * @param getNameFn - Function to extract category name
 * @returns Array of category configurations
 */
export function getCategoryConfigs(
  categories: any[], 
  colors: any, 
  isDark: boolean,
  getNameFn: (category: any) => string = (cat) => cat.name || cat.nameEn || cat.nameAr || ''
) {
  return categories.map(category => {
    const name = getNameFn(category);
    const config = getCategoryConfig(name, colors, isDark);
    
    return {
      ...category,
      ...config,
    };
  });
}

/**
 * Create tab items for category navigation
 * @param categories - Array of category objects
 * @param colors - Theme colors object
 * @param isDark - Whether dark theme is active
 * @param getNameFn - Function to extract category name
 * @param getKeyFn - Function to extract category key/id
 * @returns Array of tab items with icons and colors
 */
export function createCategoryTabs(
  categories: any[],
  colors: any,
  isDark: boolean,
  getNameFn: (category: any) => string = (cat) => cat.name || cat.nameEn || cat.nameAr || '',
  getKeyFn: (category: any) => string = (cat) => String(cat.id || cat.key || '')
) {
  // Vibrant color palette for attractive UI
  const vibrantColors = [
    { main: '#FF6B6B', bg: '#FF6B6B25' }, // Coral Red
    { main: '#4ECDC4', bg: '#4ECDC425' }, // Turquoise
    { main: '#45B7D1', bg: '#45B7D125' }, // Sky Blue
    { main: '#96CEB4', bg: '#96CEB425' }, // Mint Green
    { main: '#FFEAA7', bg: '#FFEAA725' }, // Warm Yellow
    { main: '#DDA0DD', bg: '#DDA0DD25' }, // Plum
    { main: '#98D8C8', bg: '#98D8C825' }, // Seafoam
    { main: '#F7DC6F', bg: '#F7DC6F25' }, // Golden Yellow
    { main: '#BB8FCE', bg: '#BB8FCE25' }, // Lavender
    { main: '#85C1E9', bg: '#85C1E925' }, // Light Blue
    { main: '#F8C471', bg: '#F8C47125' }, // Peach
    { main: '#82E0AA', bg: '#82E0AA25' }, // Light Green
    { main: '#F1948A', bg: '#F1948A25' }, // Salmon
    { main: '#85C1E9', bg: '#85C1E925' }, // Powder Blue
    { main: '#D7BDE2', bg: '#D7BDE225' }, // Soft Purple
  ];

  // Add "All" tab with gradient-like effect
  const allTab = {
    key: 'all',
    label: 'All',
    icon: Sparkles,
    iconColor: isDark ? '#FFD700' : '#FF6B6B', // Gold in dark, coral in light
    iconBgColor: isDark ? '#FFD70025' : '#FF6B6B25'
  };

  // Create category tabs with vibrant colors
  const categoryTabs = categories
    .filter((cat: any) => !cat.isDeleted)
    .map((category: any, index: number) => {
      const name = getNameFn(category);
      const key = getKeyFn(category);
      const config = getCategoryConfig(name, colors, isDark);
      
      // Use vibrant colors cycling through the palette
      const colorIndex = index % vibrantColors.length;
      const vibrantColor = vibrantColors[colorIndex];
      
      // Enhance colors based on theme
      const enhancedIconColor = isDark 
        ? vibrantColor.main 
        : vibrantColor.main;
      
      const enhancedBgColor = isDark 
        ? vibrantColor.main + '30' // More opacity in dark mode
        : vibrantColor.bg;
      
      return {
        key,
        label: name,
        icon: config.icon,
        iconColor: enhancedIconColor,
        iconBgColor: enhancedBgColor,
        colorKey: config.colorKey,
      };
    });

  return [allTab, ...categoryTabs];
}

/**
 * Transform categories for filter options
 * @param categories - Array of category objects from API
 * @param language - Language preference ('en' or 'ar')
 * @returns Array of filter option objects
 */
export function getCategoriesForFilter(
  categories: any[],
  language: 'en' | 'ar' = 'en'
) {
  if (!categories || !Array.isArray(categories)) {
    return [];
  }

  return categories
    .filter((category: any) => !category.isDeleted)
    .map((category: any) => {
      const name = language === 'ar' ? 
        (category.nameAr || category.name || category.nameEn || '') :
        (category.nameEn || category.name || category.nameAr || '');
      
      const config = getCategoryConfig(name, {}, false);
      
      return {
        value: String(category.id || category.categoryId || ''),
        label: name,
        icon: config.icon || DEFAULT_CATEGORY_CONFIG.icon,
        color: config.color || DEFAULT_CATEGORY_CONFIG.fallbackColor.light,
      };
    })
    .filter((option: any) => option.value && option.label);
}

/**
 * Transform subcategories for filter options
 * @param subcategories - Array of subcategory objects from API
 * @param language - Language preference ('en' or 'ar')
 * @returns Array of filter option objects
 */
export function getSubCategoriesForFilter(
  subcategories: any[],
  language: 'en' | 'ar' = 'en'
) {
  if (!subcategories || !Array.isArray(subcategories)) {
    return [];
  }

  return subcategories
    .filter((subcategory: any) => !subcategory.isDeleted)
    .map((subcategory: any) => {
      const name = language === 'ar' ? 
        (subcategory.nameAr || subcategory.name || subcategory.nameEn || '') :
        (subcategory.nameEn || subcategory.name || subcategory.nameAr || '');
      
      const config = getCategoryConfig(name, {}, false);
      
      return {
        value: String(subcategory.id || subcategory.subCategoryId || ''),
        label: name,
        icon: config.icon || DEFAULT_CATEGORY_CONFIG.icon,
        color: config.color || DEFAULT_CATEGORY_CONFIG.fallbackColor.light,
        categoryId: String(subcategory.categoryId || ''),
      };
    })
    .filter((option: any) => option.value && option.label);
}