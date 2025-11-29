# Frontend Components & Architecture

## Overview

The frontend has been refactored into a modular, reusable architecture with global components, custom hooks, and utility helpers for better scalability and maintainability.

## Directory Structure

```
src/
├── components/
│   └── common/          # Reusable UI components
├── hooks/              # Custom React hooks
├── utils/              # Helper functions and utilities
├── pages/              # Page-level components
├── services/           # API services
└── store/              # State management (Zustand)
```

## Reusable Components

### LoadingSpinner
Displays a loading indicator with optional message.

```jsx
<LoadingSpinner message="Loading products..." size={40} />
```

### ErrorDisplay
Shows error messages with optional retry functionality.

```jsx
<ErrorDisplay 
  error={error} 
  title="Error" 
  onRetry={handleRetry}
  retryLabel="Try Again"
/>
```

### EmptyState
Displays empty state with icon, message, and optional action.

```jsx
<EmptyState
  icon={ShoppingCartIcon}
  title="Your cart is empty"
  description="Add items to get started"
  actionLabel="Go Shopping"
  actionPath="/products"
/>
```

### ProductCard
Reusable product card component.

```jsx
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  showDescription={true}
  showStock={true}
/>
```

### SearchBar
Search input with icon.

```jsx
<SearchBar
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search products..."
/>
```

### PageHeader
Page header with title, subtitle, and action button.

```jsx
<PageHeader
  title="Products"
  subtitle="Browse our collection"
  actionLabel="Add Product"
  actionPath="/products/new"
/>
```

### QuantitySelector
Quantity selector with increase/decrease buttons.

```jsx
<QuantitySelector
  quantity={quantity}
  onIncrease={handleIncrease}
  onDecrease={handleDecrease}
  min={1}
  max={10}
/>
```

### OrderSummary
Order summary card with totals and checkout button.

```jsx
<OrderSummary
  items={items}
  subtotal={subtotal}
  discount={discount}
  total={total}
  checkoutPath="/checkout"
/>
```

### FormField
Reusable form input field with validation.

```jsx
<FormField
  name="email"
  label="Email"
  type="email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.email}
  touched={touched.email}
/>
```

### CartItem
Cart item component with quantity selector.

```jsx
<CartItem
  item={item}
  onQuantityChange={handleQuantityChange}
  onRemove={handleRemove}
/>
```

## Custom Hooks

### useApi
Handles API calls with loading, error, and data states.

```jsx
const { data, loading, error, execute, reset } = useApi(
  () => getAllProducts(),
  true // immediate execution
);
```

### useForm
Form state management with validation.

```jsx
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  validate,
  reset,
} = useForm(initialValues, validateFn);
```

### useDebounce
Debounces a value to reduce API calls.

```jsx
const debouncedSearchTerm = useDebounce(searchTerm, 300);
```

### usePagination
Handles pagination logic.

```jsx
const {
  currentPage,
  totalPages,
  paginatedItems,
  goToPage,
  nextPage,
  prevPage,
} = usePagination(items, itemsPerPage);
```

## Utility Functions

### Formatters
Format data for display.

```jsx
import { formatters } from '../utils';

formatters.currency(99.99); // "$99.99"
formatters.number(99.99, 2); // "99.99"
formatters.truncate("Long text...", 50); // "Long text..."
formatters.date(new Date()); // "11/29/2025"
formatters.dateTime(new Date()); // "11/29/2025, 3:45:00 PM"
```

### Validators
Form validation functions.

```jsx
import { validators } from '../utils';

validators.required(value);
validators.email(value);
validators.minLength(6)(value);
validators.combine(
  validators.required,
  validators.email
)(value);
```

### Helpers
Common helper functions.

```jsx
import { helpers } from '../utils';

helpers.getInitials("John Doe"); // "JD"
helpers.calculateTotal(items, (item) => item.price, (item) => item.quantity);
helpers.filterBySearch(items, "search term", ['name', 'description']);
helpers.sortBy(items, 'price', 'asc');
```

## Usage Examples

### Refactored ProductsPage
```jsx
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import { helpers } from '../../utils';
import { ProductCard, SearchBar, PageHeader, LoadingSpinner, ErrorDisplay } from '../../components/common';

function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, loading, error } = useApi(() => getAllProducts(), true);
  
  const products = data?.metadata || [];
  const filteredProducts = helpers.filterBySearch(products, debouncedSearchTerm, ['product_name']);
  
  return (
    <Container>
      <PageHeader title="Products" actionLabel="Add Product" actionPath="/products/new" />
      <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      {loading && <LoadingSpinner />}
      <ErrorDisplay error={error} />
      <Grid>
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </Grid>
    </Container>
  );
}
```

## Benefits

1. **Reusability**: Components can be used across multiple pages
2. **Consistency**: Uniform UI patterns throughout the app
3. **Maintainability**: Changes in one place affect all usages
4. **Scalability**: Easy to add new features using existing components
5. **Testability**: Isolated components are easier to test
6. **Developer Experience**: Less code duplication, cleaner pages

