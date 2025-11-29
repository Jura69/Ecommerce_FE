import { useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { productService } from '../../services/api';
import { useCartStore } from '../../store';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import { helpers } from '../../utils';
import {
  LoadingSpinner,
  ErrorDisplay,
  EmptyState,
  ProductCard,
  SearchBar,
  PageHeader,
} from '../../components/common';
import { Product } from '../../types';

function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { addToCart } = useCartStore();

  const { data: response, loading, error, execute } = useApi(
    () => productService.getAllProducts(),
    true
  );

  const products = response?.metadata || [];
  const filteredProducts = helpers.filterBySearch(
    products,
    debouncedSearchTerm,
    ['product_name', 'product_description']
  );

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="Products"
        actionLabel="Add Product"
        actionPath="/products/new"
      />

      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
      />

      {loading && <LoadingSpinner />}

      <ErrorDisplay error={error} onRetry={execute} />

      {!loading && !error && filteredProducts.length === 0 && (
        <EmptyState
          title={searchTerm ? 'No products found' : 'No products available'}
          description={
            searchTerm
              ? 'Try a different search term'
              : 'There are no products available at the moment'
          }
        />
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filteredProducts.length} of {products.length} products
          </Typography>
          <Grid container spacing={3}>
            {filteredProducts.map((product: Product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}

export default ProductsPage;

