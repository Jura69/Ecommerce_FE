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
import { LoadingSpinner } from '../../components/common';
import { Product } from '../../types';
import { tokens } from '../../theme/theme';

function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addSuccess, setAddSuccess] = useState(false);

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

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product._id, quantity);
    setAddSuccess(true);
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) setQuantity(value);
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

  const isOutOfStock = product.product_quantity === 0;

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

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontFamily: '"Rubik", sans-serif',
                  color: tokens.colors.gold700,
                  mb: 2,
                }}
              >
                ${product.product_price}
              </Typography>

              <Typography variant="body1" sx={{ color: tokens.colors.stone600, mb: 3, lineHeight: 1.7 }}>
                {product.product_description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: tokens.colors.stone500, width: 80 }}>Type:</Typography>
                  <Chip label={product.product_type} size="small" sx={{ bgcolor: tokens.colors.stone100, fontWeight: 600 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: tokens.colors.stone500, width: 80 }}>Shop:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {(product.product_shop as any)?.name || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: tokens.colors.stone500, width: 80 }}>Stock:</Typography>
                  <Chip
                    label={isOutOfStock ? 'Out of Stock' : `${product.product_quantity} available`}
                    size="small"
                    sx={{
                      bgcolor: isOutOfStock ? tokens.colors.errorBg : tokens.colors.successBg,
                      color: isOutOfStock ? tokens.colors.error : tokens.colors.success,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                <TextField
                  type="number"
                  label="Qty"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: product.product_quantity }}
                  size="small"
                  sx={{ width: 80 }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={cartLoading || isOutOfStock}
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
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
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
