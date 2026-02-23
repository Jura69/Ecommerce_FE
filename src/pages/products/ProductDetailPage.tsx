import { useEffect, useState, ChangeEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Button,
  TextField,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { productService } from '../../services/api';
import { useCartStore } from '../../store';
import CommentSection from '../../components/common/CommentSection';
import ReviewSection from '../../components/common/ReviewSection';
import { LoadingSpinner, FollowButton, VariationSelector } from '../../components/common';
import type { SelectedSku } from '../../components/common/VariationSelector';
import { Product } from '../../types';
import { tokens } from '../../theme/theme';
import { formatters } from '../../utils';

function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addSuccess, setAddSuccess] = useState(false);
  const [selectedSku, setSelectedSku] = useState<SelectedSku | null>(null);

  const { addToCart, loading: cartLoading } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(productId!);
        setProduct(response?.metadata || null);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product details.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const hasVariations = product?.product_variations?.length > 0 && product?.skus?.length > 0;

  const handleAddToCart = async () => {
    if (!product) return;
    const shopId = typeof product.product_shop === 'string' ? product.product_shop : (product.product_shop as any)?._id || '';

    // If product has variations, require SKU selection
    if (hasVariations && !selectedSku) return;

    const price = selectedSku?.price ?? product.product_price;

    await addToCart(product._id, quantity, shopId, {
      name: product.product_name,
      price,
      thumb: product.product_thumb,
      skuId: selectedSku?.skuId,
      variationLabel: selectedSku?.label,
    });
    setAddSuccess(true);
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) setQuantity(value);
  };

  const handleSkuSelect = (sku: SelectedSku | null) => {
    setSelectedSku(sku);
    setQuantity(1); // Reset quantity on SKU change
  };

  if (loading) return <LoadingSpinner message="Loading product details..." />;
  if (error) return <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>;
  if (!product) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Product not found.</Typography>
        <Button component={Link} to="/products" variant="contained">Back to Products</Button>
      </Box>
    );
  }

  const currentPrice = selectedSku?.price ?? product.product_price;
  const currentStock = selectedSku?.stock ?? product.product_quantity;
  const isOutOfStock = currentStock === 0;
  const needsSkuSelection = hasVariations && !selectedSku;

  return (
    <Box>
      <Button
        component={Link}
        to="/products"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: tokens.colors.stone500 }}
      >
        Back to Products
      </Button>

      <Paper sx={{ overflow: 'hidden', border: `1px solid ${tokens.colors.stone200}` }}>
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ bgcolor: tokens.colors.stone100, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
              <Box
                component="img"
                src={product.product_thumb}
                alt={product.product_name}
                sx={{ maxWidth: '100%', maxHeight: 360, objectFit: 'contain', borderRadius: '8px' }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: tokens.colors.stone900 }}>
                {product.product_name}
              </Typography>

              {/* Price — show from VariationSelector or fallback */}
              {!hasVariations && (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontFamily: '"Rubik", sans-serif',
                    color: tokens.colors.gold700,
                    mb: 2,
                  }}
                >
                  {formatters.currency(product.product_price)}
                </Typography>
              )}

              <Typography variant="body1" sx={{ color: tokens.colors.stone600, mb: 3, lineHeight: 1.7 }}>
                {product.product_description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Variation Selector */}
              {hasVariations && (
                <Box sx={{ mb: 3 }}>
                  <VariationSelector
                    variations={product.product_variations}
                    skus={product.skus}
                    onSelect={handleSkuSelect}
                  />
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: tokens.colors.stone500, width: 80 }}>Type:</Typography>
                  <Chip label={product.product_type} size="small" sx={{ bgcolor: tokens.colors.stone100, fontWeight: 600 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: tokens.colors.stone500, width: 80 }}>Shop:</Typography>
                  {typeof product.product_shop === 'object' && (product.product_shop as any)?._id ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography
                        component={Link}
                        to={`/shop/${(product.product_shop as any)._id}`}
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: tokens.colors.gold700,
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {(product.product_shop as any).name}
                      </Typography>
                      <FollowButton shopId={(product.product_shop as any)._id} />
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>N/A</Typography>
                  )}
                </Box>
                {!hasVariations && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: tokens.colors.stone500, width: 80 }}>Stock:</Typography>
                    <Chip
                      label={isOutOfStock ? 'Out of Stock' : `${currentStock} available`}
                      size="small"
                      sx={{
                        bgcolor: isOutOfStock ? tokens.colors.errorBg : tokens.colors.successBg,
                        color: isOutOfStock ? tokens.colors.error : tokens.colors.success,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                <TextField
                  type="number"
                  label="Qty"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: currentStock }}
                  size="small"
                  sx={{ width: 80 }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={cartLoading || isOutOfStock || needsSkuSelection}
                  startIcon={<AddShoppingCartIcon />}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    background: tokens.gradients.gold,
                    color: '#FFFFFF',
                    boxShadow: tokens.shadows.gold,
                    '&:hover': { boxShadow: tokens.shadows.goldHover },
                  }}
                >
                  {isOutOfStock
                    ? 'Out of Stock'
                    : needsSkuSelection
                      ? 'Select Options'
                      : 'Add to Cart'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, border: `1px solid ${tokens.colors.stone200}` }}>
        <ReviewSection productId={productId!} />
      </Paper>

      <Paper sx={{ p: 3, mt: 3, border: `1px solid ${tokens.colors.stone200}` }}>
        <CommentSection productId={productId!} />
      </Paper>

      <Snackbar open={addSuccess} autoHideDuration={4000} onClose={() => setAddSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setAddSuccess(false)} severity="success" sx={{ width: '100%' }}>Product added to cart!</Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductDetailPage;
