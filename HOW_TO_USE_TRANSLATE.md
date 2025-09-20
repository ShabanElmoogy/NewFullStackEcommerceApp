# 🌐 How to Use the Translation App

## 📱 **Step-by-Step Guide**

### **1. Access the Translation Manager**
1. Open your app
2. Go to **Profile** screen (bottom tab)
3. Scroll down to **Support** section
4. Tap on **"Translation Manager"**

### **2. Understanding the Interface**

#### **📊 Statistics Bar (Top)**
- **Total**: Total number of translation keys
- **Completed**: Keys that have both English and Arabic translations
- **Missing**: Keys missing Arabic translations (shown in red)
- **Complete**: Overall completion percentage

#### **🔍 Search Bar**
- Type to search for specific translations
- Searches in keys, English text, and Arabic text

#### **🏷️ Category Filters**
- **All**: Show all translations
- **home**: Home screen translations
- **common**: Common UI elements (loading, error, etc.)
- **navigation**: Navigation labels
- **auth**: Login/signup related
- **profile**: Profile screen text
- **products**: Product-related text
- **settings**: App settings

### **3. How to Edit Translations**

#### **Edit English Text:**
1. Find the translation you want to edit
2. Tap in the **English** text field
3. Make your changes
4. The changes are saved automatically

#### **Add Arabic Translation:**
1. Find a translation with "Missing translation" label
2. Tap in the **العربية** (Arabic) text field
3. Type the Arabic translation
4. The text will automatically align right-to-left

#### **Save Your Work:**
1. Tap the **Save** button in the top-right corner
2. Confirm when prompted
3. Your translations are saved!

### **4. Example Usage**

Let's say you want to add Arabic translation for "Welcome":

1. **Search**: Type "welcome" in search bar
2. **Find**: Look for the "welcome" key in "home" category
3. **Edit**: Tap the Arabic field and type "مرحباً"
4. **Save**: Tap Save button

### **5. Tips for Good Translations**

#### **For Arabic Translations:**
- Use proper Arabic grammar and spelling
- Consider cultural context
- Keep the same tone as English (formal/casual)
- Test how it looks in the app

#### **For English Edits:**
- Keep text concise for mobile screens
- Use consistent terminology
- Consider different screen sizes

### **6. Using Translations in Your Code**

After adding translations, use them in your components:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <Text>{t('home.welcome')}</Text>  // Shows "Welcome" or "مرحباً"
  );
}
```

### **7. Common Tasks**

#### **Add New Home Screen Text:**
1. Go to Translation Manager
2. Filter by "home" category
3. Look for missing translations (red numbers)
4. Add Arabic translations
5. Save

#### **Fix Missing Translations:**
1. Look at the red "Missing" number in stats
2. Search for empty Arabic fields
3. Add translations one by one
4. Watch the completion percentage increase

#### **Update Promotional Text:**
1. Search for the text you want to change
2. Edit both English and Arabic versions
3. Save changes
4. Text updates throughout the app

### **8. Troubleshooting**

#### **Can't Find Translation Manager?**
- Make sure you're on the Profile screen
- Scroll down to Support section
- Look for the Languages icon

#### **Arabic Text Not Showing Correctly?**
- Make sure you're typing in the Arabic field (right-aligned)
- Check that your device supports Arabic fonts
- Try switching app language to test

#### **Changes Not Saving?**
- Make sure to tap the Save button
- Check for any error messages
- Try closing and reopening the app

### **9. Best Practices**

✅ **Do:**
- Test translations in both languages
- Keep translations consistent across the app
- Save your work frequently
- Use the search function to find related translations

❌ **Don't:**
- Leave translations half-finished
- Use Google Translate for everything (context matters!)
- Forget to save your changes
- Make translations too long for mobile screens

### **10. Quick Reference**

| Action | How To |
|--------|--------|
| Access | Profile → Support → Translation Manager |
| Search | Type in search bar |
| Filter | Tap category buttons |
| Edit | Tap text field and type |
| Save | Tap Save button (top-right) |
| Find Missing | Look for red "Missing translation" labels |

---

**🎉 You're ready to manage translations like a pro!**

The Translation Manager makes it easy to keep your app's text up-to-date in both English and Arabic. Start with the home screen translations and work your way through each category.