import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment';
import { checkoutService, discountService } from '../../services/api';
import { useCartStore } from '../../store';
import { DiscountAmount } from '../../types';

interface CheckoutData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<DiscountAmount | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartProducts = cart?.cart_products || [];
  const subtotal = cartProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discountAmount = discountApplied?.discountAmount || 0;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    try {
      setDiscountError(null);
      const response = await discountService.getDiscountAmount({
        codeId: discountCode,
        userId: cart?.cart_userId || '',
        shopId: cart?.cart_shopId || '',
        products: cartProducts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if (response?.metadata) {
        setDiscountApplied(response.metadata);
      }
    } catch (err: any) {
      setDiscountError(err.message || 'Invalid discount code');
      setDiscountApplied(null);
    }
  };

  const handleCheckout = async () => {
    if (!checkoutData.street || !checkoutData.city || !checkoutData.zipCode) {
      setError('Please fill in all required address fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const reviewData: any = {
        shop_order_ids: [
          {
            shopId: cart?.cart_shopId || '',
            shop_discounts: discountApplied
              ? [{ codeId: discountCode, discountId: discountApplied.discountId }]
              : [],
            item_products: cartProducts.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        ],
        user_address: checkoutData,
        user_payment: {
          method: 'COD',
        },
      };

      const response = await checkoutService.checkoutReview(reviewData);
      
      if (response?.metadata) {
        navigate('/checkout/success', { state: { order: response.metadata } });
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CheckoutData) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setCheckoutData({ ...checkoutData, [field]: e.target.value });
  };

  if (!cart || cartProducts.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/cart')}
          sx={{ mt: 2 }}
        >
          Go to Cart
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/cart')}
        sx={{ mb: 3 }}
      >
        Back to Cart
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={checkoutData.street}
                  onChange={handleInputChange('street')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={checkoutData.city}
                  onChange={handleInputChange('city')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={checkoutData.state}
                  onChange={handleInputChange('state')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  value={checkoutData.zipCode}
                  onChange={handleInputChange('zipCode')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={checkoutData.country}
                  onChange={handleInputChange('country')}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Discount Code
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Enter discount code"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value);
                  setDiscountError(null);
                  setDiscountApplied(null);
                }}
                error={!!discountError}
                helperText={discountError}
              />
              <Button
                variant="outlined"
                onClick={handleApplyDiscount}
                sx={{ minWidth: 120 }}
              >
                Apply
              </Button>
            </Box>
            {discountApplied && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Discount applied! You saved ${discountAmount.toFixed(2)}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            {cartProducts.map((item) => (
              <Box key={item.productId} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.quantity} × ${item.price.toFixed(2)}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>
            {discountApplied && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="success.main">Discount</Typography>
                <Typography color="success.main">
                  -${discountAmount.toFixed(2)}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography>Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCheckout}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

