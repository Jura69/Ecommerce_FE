import { useEffect, useState, ChangeEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { productService } from '../../services/api';
import { useCartStore } from '../../store';
import CommentSection from '../../components/common/CommentSection';
import { Product } from '../../types';

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

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product._id, quantity);
    setAddSuccess(true);
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleCloseSnackbar = () => {
    setAddSuccess(false);
  };

  if (loading) {
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>;
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5">Product not found.</Typography>
        <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="400"
              image={product.product_thumb}
              alt={product.product_name}
              sx={{ objectFit: 'contain', p: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.product_name}
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                ${product.product_price}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.product_description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  Type:
                </Typography>
                <Chip label={product.product_type} color="primary" variant="outlined" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  Shop:
                </Typography>
                <Typography variant="body2">
                  {(product.product_shop as any)?.name || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  In Stock:
                </Typography>
                <Typography variant="body2">{product.product_quantity}</Typography>
              </Box>
              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: product.product_quantity }}
                  sx={{ width: '100px' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  startIcon={cartLoading ? <CircularProgress size={20} /> : <AddShoppingCartIcon />}
                >
                  Add to Cart
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button component={Link} to="/products">
          &larr; Back to all products
        </Button>
      </Box>

      <Paper sx={{ p: 3, mt: 4 }}>
        <CommentSection productId={productId!} />
      </Paper>

      <Snackbar
        open={addSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Product added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProductDetailPage;

