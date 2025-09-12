# SearchInput Component

A reusable, customizable search input component with animations, suggestions, and auto-search functionality.

## Features

- 🔍 **Search Icon**: Always visible search icon with focus states
- ✨ **Smooth Animations**: Scale and shadow animations on focus
- 🎯 **Auto Search**: Optional debounced auto-search functionality
- 💡 **Suggestions**: Dropdown suggestions with popular searches
- 🎨 **Multiple Variants**: Default, rounded, and minimal styles
- 📏 **Multiple Sizes**: Small, medium, and large sizes
- ❌ **Clear Button**: X button to clear search text
- ♿ **Accessible**: Proper keyboard navigation and screen reader support

## Basic Usage

```tsx
import SearchInput from '@/components/ui/SearchInput';

function MyComponent() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchInput
      value={searchQuery}
      placeholder="Search..."
      onChangeText={setSearchQuery}
      onSearch={(query) => console.log('Searching for:', query)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Current search value |
| `placeholder` | `string` | `'Search...'` | Placeholder text |
| `onChangeText` | `(text: string) => void` | - | Called when text changes |
| `onSearch` | `(text: string) => void` | - | Called when search is triggered |
| `onFocus` | `() => void` | - | Called when input is focused |
| `onBlur` | `() => void` | - | Called when input loses focus |
| `onClear` | `() => void` | - | Called when clear button is pressed |
| `showSuggestions` | `boolean` | `false` | Show suggestions dropdown |
| `suggestions` | `string[]` | `[]` | Array of suggestion strings |
| `onSuggestionPress` | `(suggestion: string) => void` | - | Called when suggestion is selected |
| `autoSearch` | `boolean` | `false` | Enable auto-search with debounce |
| `searchDelay` | `number` | `500` | Debounce delay in milliseconds |
| `variant` | `'default' \| 'rounded' \| 'minimal'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `disabled` | `boolean` | `false` | Disable the input |
| `className` | `string` | `''` | Additional CSS classes |

## Variants

### Default
```tsx
<SearchInput variant="default" />
```
- Standard outline border
- White background
- Subtle shadow

### Rounded
```tsx
<SearchInput variant="rounded" />
```
- Fully rounded corners
- Gray background
- Prominent shadow

### Minimal
```tsx
<SearchInput variant="minimal" />
```
- Underlined style
- Transparent background
- Clean appearance

## Sizes

### Small
```tsx
<SearchInput size="sm" />
```
- Compact height
- Smaller icons and text

### Medium (Default)
```tsx
<SearchInput size="md" />
```
- Standard height
- Balanced proportions

### Large
```tsx
<SearchInput size="lg" />
```
- Larger height
- Bigger icons and text

## Auto Search

Enable automatic search with debounce:

```tsx
<SearchInput
  autoSearch={true}
  searchDelay={300}
  onSearch={(query) => {
    // This will be called 300ms after user stops typing
    performSearch(query);
  }}
/>
```

## Suggestions

Show dropdown suggestions:

```tsx
<SearchInput
  showSuggestions={true}
  suggestions={['iPhone', 'Samsung', 'MacBook']}
  onSuggestionPress={(suggestion) => {
    // Handle suggestion selection
    setSearchQuery(suggestion);
    performSearch(suggestion);
  }}
/>
```

## Usage Examples

### 1. Home Page Search Bar
```tsx
<SearchInput
  placeholder="Search products..."
  variant="rounded"
  size="lg"
  autoSearch={true}
  onSearch={(query) => router.push(`/products?search=${query}`)}
  showSuggestions={true}
  suggestions={['Electronics', 'Clothing', 'Books']}
/>
```

### 2. Products Page Search
```tsx
<SearchInput
  value={searchQuery}
  placeholder="Search products, brands, categories..."
  onChangeText={setSearchQuery}
  variant="default"
  size="lg"
/>
```

### 3. Header Search
```tsx
<SearchInput
  placeholder="Search in app..."
  variant="minimal"
  size="md"
  autoSearch={true}
  searchDelay={500}
  onSearch={handleGlobalSearch}
/>
```

### 4. Modal Search
```tsx
<SearchInput
  placeholder="Search users..."
  variant="rounded"
  size="sm"
  showSuggestions={true}
  suggestions={recentSearches}
  onSuggestionPress={selectUser}
/>
```

## Styling

The component uses Tailwind CSS classes and can be customized:

```tsx
<SearchInput
  className="my-4 mx-2"
  // Additional styling through className
/>
```

## Accessibility

- Proper keyboard navigation
- Screen reader support
- Focus management
- ARIA labels and roles

## Animation Details

- **Focus Animation**: Subtle scale (1.01x) and shadow increase
- **Button Animation**: Filter/action buttons scale on press
- **Smooth Transitions**: All animations use spring physics
- **Performance**: Optimized with React Native Reanimated

## Integration with Navigation

```tsx
// Navigate to search results
const handleSearch = (query: string) => {
  router.push(`/search?q=${encodeURIComponent(query)}`);
};

// Navigate with filters
const handleSearchWithCategory = (query: string, category: string) => {
  router.push(`/products?search=${query}&category=${category}`);
};
```

## Best Practices

1. **Debounce**: Use `autoSearch` with appropriate `searchDelay` for API calls
2. **Suggestions**: Provide relevant, recent, or popular suggestions
3. **Placeholder**: Use descriptive placeholder text
4. **Feedback**: Show loading states during search
5. **Clear**: Always provide a way to clear the search
6. **Responsive**: Test on different screen sizes
7. **Performance**: Avoid re-renders with proper state management