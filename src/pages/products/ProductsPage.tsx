import { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Pagination,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useCartStore } from '../../store';
import {
  LoadingSpinner,
  ErrorDisplay,
  EmptyState,
  ProductCard,
  SearchBar,
  PageHeader,
} from '../../components/common';
import FilterPanel from '../../components/common/FilterPanel';
import SortDropdown from '../../components/common/SortDropdown';
import { categoryService } from '../../services/api/categoryService';
import { Product } from '../../types';

function ProductsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCartStore();

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  // Data state
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mobile filter drawer
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getProductsAdvanced({
        category: selectedCategory || undefined,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        rating: rating || undefined,
        search: searchTerm || undefined,
        sort: sortBy,
        page,
        limit: 12,
      });
      const data = response?.metadata;
      if (data) {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, priceMin, priceMax, rating, searchTerm, sortBy, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleApplyFilters = () => {
    setPage(1);
    setFilterOpen(false);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setPriceMin('');
    setPriceMax('');
    setRating(0);
    setPage(1);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const shopId = typeof product.product_shop === 'string' ? product.product_shop : (product.product_shop as any)?._id || '';
      await addToCart(product._id, 1, shopId, {
        name: product.product_name,
        price: product.product_price,
        thumb: product.product_thumb,
      });
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const filterPanelContent = (
    <FilterPanel
      selectedCategory={selectedCategory}
      priceMin={priceMin}
      priceMax={priceMax}
      rating={rating}
      onCategoryChange={setSelectedCategory}
      onPriceMinChange={setPriceMin}
      onPriceMaxChange={setPriceMax}
      onRatingChange={setRating}
      onApply={handleApplyFilters}
      onClear={handleClearFilters}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <PageHeader
        title="Products"
        actionLabel="Add Product"
        actionPath="/products/new"
      />

      {/* Search + Sort bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        {isMobile && (
          <IconButton onClick={() => setFilterOpen(true)} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <FilterListIcon />
          </IconButton>
        )}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <SearchBar
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
          />
        </Box>
        <SortDropdown value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} />
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar filters — desktop only */}
        {!isMobile && (
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={1}>
              {filterPanelContent}
            </Paper>
          </Grid>
        )}

        {/* Product grid */}
        <Grid size={{ xs: 12, md: isMobile ? 12 : 9 }}>
          {loading && <LoadingSpinner />}

          {error && <ErrorDisplay error={error} onRetry={fetchProducts} />}

          {!loading && !error && products.length === 0 && (
            <EmptyState
              title={searchTerm ? 'No products found' : 'No products available'}
              description={
                searchTerm
                  ? 'Try a different search term or clear filters'
                  : 'There are no products available at the moment'
              }
            />
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing {products.length} of {total} products
              </Typography>
              <Grid container spacing={2}>
                {products.map((product: Product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, newPage) => setPage(newPage)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile filter drawer */}
      <Drawer
        anchor="left"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        {filterPanelContent}
      </Drawer>
    </Container>
  );
}

export default ProductsPage;
