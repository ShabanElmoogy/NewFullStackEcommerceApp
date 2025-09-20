# 🌐 Translation Usage Examples

## 🚀 **Real Translation App is Ready!**

Your translation app is now fully integrated and working. Here's how to use it:

### **📱 Access the Translation Manager**
1. Open your app
2. Go to **Profile** (bottom tab)
3. Scroll to **Support** section
4. Tap **"Translation Manager"**

### **🎯 What You'll See**
- **📊 Live Statistics**: Total, Completed, Missing translations with percentages
- **🔍 Search Bar**: Find any translation instantly
- **🏷️ Category Filters**: Filter by home, common, navigation, auth, etc.
- **✏️ Live Editing**: Edit English and Arabic translations in real-time
- **💾 Save Button**: Saves all your changes (lights up when you have unsaved changes)

---

## 💻 **How to Use Translations in Your Code**

### **Basic Usage**
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('home.welcome')}</Text>           {/* "Welcome" or "مرحباً" */}
      <Text>{t('home.featuredProducts')}</Text>  {/* "Featured Products" or "المنتجات المميزة" */}
      <Text>{t('common.loading')}</Text>         {/* "Loading..." or "جاري التحميل..." */}
    </View>
  );
}
```

### **With Your UI Components**
```typescript
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';

function HomeScreen() {
  const { t } = useTranslation();
  
  return (
    <ScrollView>
      <Text className="text-2xl font-bold">
        {t('home.welcome')}
      </Text>
      
      <Text className="text-lg">
        {t('home.featuredProducts')}
      </Text>
      
      <TouchableOpacity>
        <Text className="text-primary">
          {t('home.shopNow')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

### **Button Examples**
```typescript
// Shop Now Button
<TouchableOpacity style={styles.button}>
  <Text style={styles.buttonText}>
    {t('home.shopNow')}  {/* "Shop Now" or "تسوق الآن" */}
  </Text>
</TouchableOpacity>

// View All Button
<Pressable onPress={handleViewAll}>
  <Text>{t('home.viewAll')}</Text>  {/* "View All" or "عرض الكل" */}
</Pressable>
```

### **Search Placeholder**
```typescript
<TextInput
  placeholder={t('home.searchPlaceholder')}  {/* "Search products..." or "البحث عن المنتجات..." */}
  style={styles.searchInput}
/>
```

### **Loading States**
```typescript
{isLoading ? (
  <Text>{t('common.loading')}</Text>  {/* "Loading..." or "جاري التحميل..." */}
) : (
  <Text>{t('home.featuredProducts')}</Text>
)}
```

---

## 🏠 **Available Home Translations**

All these are ready to use in your app:

| Key | English | Arabic |
|-----|---------|--------|
| `home.welcome` | Welcome | مرحباً |
| `home.featuredProducts` | Featured Products | المنتجات المميزة |
| `home.categories` | Categories | الفئات |
| `home.newArrivals` | New Arrivals | وصل حديثاً |
| `home.bestSellers` | Best Sellers | الأكثر مبيعاً |
| `home.specialOffers` | Special Offers | عروض خاصة |
| `home.viewAll` | View All | عرض الكل |
| `home.shopNow` | Shop Now | تسوق الآن |
| `home.discountBanner` | Up to 50% Off | خصم يصل إلى 50% |
| `home.freeShipping` | Free Shipping | شحن مجاني |
| `home.searchPlaceholder` | Search products... | البحث عن المنتجات... |
| `home.noProductsFound` | No products found | لم يتم العثور على منتجات |
| `home.loadMore` | Load More | تحميل المزيد |
| `home.refreshing` | Refreshing... | جاري التحديث... |
| `home.seeMore` | See More | المزيد |

---

## 🎨 **Real-World Examples**

### **Home Screen Header**
```typescript
function HomeHeader() {
  const { t } = useTranslation();
  
  return (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>
        {t('home.welcome')}
      </Text>
      <Text style={styles.subtitle}>
        {t('home.discountBanner')}
      </Text>
    </View>
  );
}
```

### **Product Section**
```typescript
function ProductSection() {
  const { t } = useTranslation();
  
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('home.featuredProducts')}
        </Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllText}>
            {t('home.viewAll')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Product list here */}
      
      <TouchableOpacity style={styles.shopButton}>
        <Text style={styles.shopButtonText}>
          {t('home.shopNow')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

### **Search Component**
```typescript
function SearchBar() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  
  return (
    <TextInput
      value={query}
      onChangeText={setQuery}
      placeholder={t('home.searchPlaceholder')}
      style={styles.searchInput}
    />
  );
}
```

---

## 🔧 **Managing Translations**

### **Adding New Translations**
1. Go to Translation Manager
2. Find missing translations (red indicators)
3. Add Arabic translations
4. Save your changes

### **Editing Existing Translations**
1. Search for the translation you want to edit
2. Modify the text in either language
3. Save button will light up
4. Tap Save to apply changes

### **Checking Progress**
- **Statistics bar** shows your completion percentage
- **Green numbers** = completed translations
- **Red numbers** = missing translations
- **Filter by category** to focus on specific sections

---

## ✅ **You're All Set!**

The translation app is now fully functional and integrated with your app's theme system. You can:

- ✅ **Manage all translations** from one interface
- ✅ **See real-time statistics** and progress
- ✅ **Search and filter** translations easily  
- ✅ **Edit both languages** with proper RTL support
- ✅ **Use translations** in your components immediately

**Start using translations in your components with `t('home.welcome')` and manage them through the Translation Manager!**