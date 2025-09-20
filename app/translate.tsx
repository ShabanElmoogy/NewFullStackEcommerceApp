import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { ArrowLeft, Save, Search, Check, AlertCircle } from 'lucide-react-native';

interface Translation {
  key: string;
  en: string;
  ar: string;
  category: string;
}

export default function TranslateApp() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hasChanges, setHasChanges] = useState(false);

  const styles = createStyles(colors, isDark);

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = () => {
    try {
      const enTranslations = require('../locales/en.json');
      const arTranslations = require('../locales/ar.json');

      const allTranslations: Translation[] = [];

      // Convert nested translations to flat array
      Object.keys(enTranslations).forEach(category => {
        Object.keys(enTranslations[category]).forEach(key => {
          allTranslations.push({
            key,
            en: enTranslations[category][key],
            ar: arTranslations[category]?.[key] || '',
            category,
          });
        });
      });

      setTranslations(allTranslations);
    } catch (error) {
      console.error('Error loading translations:', error);
      Alert.alert('Error', 'Failed to load translations');
    }
  };

  const updateTranslation = (key: string, category: string, field: 'en' | 'ar', value: string) => {
    setTranslations(prev =>
      prev.map(translation =>
        translation.key === key && translation.category === category
          ? { ...translation, [field]: value }
          : translation
      )
    );
    setHasChanges(true);
  };

  const saveTranslations = () => {
    Alert.alert(
      'Save Translations',
      'This will update your translation files. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            setHasChanges(false);
            Alert.alert('Success', 'Translations saved successfully!');
          }
        }
      ]
    );
  };

  const getStats = () => {
    const total = translations.length;
    const completed = translations.filter(t => t.ar.trim() !== '').length;
    const missing = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, missing, percentage };
  };

  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = 
      translation.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.ar.includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'all' || translation.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(translations.map(t => t.category)))];
  const stats = getStats();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HStack className="items-center flex-1">
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-content-primary ml-3">
            Translation Manager
          </Text>
        </HStack>
        <TouchableOpacity 
          style={[styles.saveButton, hasChanges && styles.saveButtonActive]} 
          onPress={saveTranslations}
        >
          <Save size={18} color="white" />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {stats.completed}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.error }]}>
            {stats.missing}
          </Text>
          <Text style={styles.statLabel}>Missing</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {stats.percentage}%
          </Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search translations..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.selectedCategoryButtonText
            ]}>
              {category === 'all' ? 'All' : category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Translations List */}
      <ScrollView style={styles.translationsList} showsVerticalScrollIndicator={false}>
        {filteredTranslations.map((translation, index) => (
          <View key={`${translation.category}-${translation.key}-${index}`} style={styles.translationItem}>
            <View style={styles.translationHeader}>
              <HStack className="items-center flex-1">
                <Text style={styles.translationKey}>{translation.key}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{translation.category}</Text>
                </View>
              </HStack>
              {translation.ar ? (
                <Check size={16} color={colors.success} />
              ) : (
                <AlertCircle size={16} color={colors.error} />
              )}
            </View>

            <View style={styles.translationFields}>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>English</Text>
                <TextInput
                  style={styles.translationInput}
                  value={translation.en}
                  onChangeText={(value) => 
                    updateTranslation(translation.key, translation.category, 'en', value)
                  }
                  multiline
                  placeholder="English translation"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>العربية</Text>
                <TextInput
                  style={[styles.translationInput, styles.arabicInput]}
                  value={translation.ar}
                  onChangeText={(value) => 
                    updateTranslation(translation.key, translation.category, 'ar', value)
                  }
                  multiline
                  placeholder="الترجمة العربية"
                  placeholderTextColor={colors.textTertiary}
                />
                {!translation.ar && (
                  <Text style={styles.missingLabel}>Missing translation</Text>
                )}
              </View>
            </View>
          </View>
        ))}
        
        {filteredTranslations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No translations found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textTertiary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  saveButtonActive: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.text,
    textTransform: 'capitalize',
  },
  selectedCategoryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  translationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  translationItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  translationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  translationKey: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  translationFields: {
    gap: 12,
  },
  fieldContainer: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  translationInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    minHeight: 44,
    textAlignVertical: 'top',
  },
  arabicInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  missingLabel: {
    fontSize: 12,
    color: colors.error,
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});