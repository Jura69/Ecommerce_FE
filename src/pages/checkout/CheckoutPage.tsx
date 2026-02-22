import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { checkoutService, discountService } from '../../services/api';
import { useCartStore } from '../../store';
import { DiscountAmount } from '../../types';
import { tokens } from '../../theme/theme';
import { PageHeader } from '../../components/common';

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
    street: '', city: '', state: '', zipCode: '', country: '',
  });

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const safeNum = (v: any) => (typeof v === 'number' && !isNaN(v) ? v : 0);
  const cartProducts = cart?.cart_products || [];
  const subtotal = cartProducts.reduce((total: number, item: any) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  const discountAmount = discountApplied?.discountAmount || 0;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) { setDiscountError('Please enter a discount code'); return; }
    try {
      setDiscountError(null);
      const response = await discountService.getDiscountAmount({
        codeId: discountCode, userId: cart?.cart_userId || '', shopId: cart?.cart_shopId || '',
        products: cartProducts.map((item) => ({ productId: item.productId, quantity: item.quantity, price: item.price })),
      });
      if (response?.metadata) setDiscountApplied(response.metadata);
    } catch (err: any) { setDiscountError(err.message || 'Invalid discount code'); setDiscountApplied(null); }
  };

  const handleCheckout = async () => {
    if (!checkoutData.street || !checkoutData.city || !checkoutData.zipCode) { setError('Please fill in all required address fields'); return; }
    try {
      setLoading(true); setError(null);
      const reviewData: any = {
        shop_order_ids: [{
          shopId: cart?.cart_shopId || '',
          shop_discounts: discountApplied ? [{ codeId: discountCode, discountId: discountApplied.discountId }] : [],
          item_products: cartProducts.map((item) => ({ productId: item.productId, quantity: item.quantity, price: item.price })),
        }],
        user_address: checkoutData, user_payment: { method: 'COD' },
      };
      const response = await checkoutService.checkoutReview(reviewData);
      if (response?.metadata) navigate('/checkout/success', { state: { order: response.metadata } });
    } catch (err: any) { setError(err.message || 'Checkout failed. Please try again.'); } finally { setLoading(false); }
  };

  const handleInputChange = (field: keyof CheckoutData) => (e: ChangeEvent<HTMLInputElement>) => {
    setCheckoutData({ ...checkoutData, [field]: e.target.value });
  };

  if (!cart || cartProducts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ mb: 2, color: tokens.colors.stone700 }}>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/cart')}>Go to Cart</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/cart')} sx={{ mb: 2, color: tokens.colors.stone500 }}>
        Back to Cart
      </Button>
      <PageHeader title="Checkout" subtitle="Complete your order" />

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Shipping */}
          <Paper sx={{ p: 3, mb: 3, border: `1px solid ${tokens.colors.stone200}` }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Shipping Address</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}><TextField fullWidth label="Street Address" value={checkoutData.street} onChange={handleInputChange('street')} required /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="City" value={checkoutData.city} onChange={handleInputChange('city')} required /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="State" value={checkoutData.state} onChange={handleInputChange('state')} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Zip Code" value={checkoutData.zipCode} onChange={handleInputChange('zipCode')} required /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Country" value={checkoutData.country} onChange={handleInputChange('country')} /></Grid>
            </Grid>
          </Paper>

          {/* Discount */}
          <Paper sx={{ p: 3, border: `1px solid ${tokens.colors.stone200}` }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle', color: tokens.colors.gold600 }} />
              Discount Code
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField fullWidth label="Enter discount code" value={discountCode}
                onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(null); setDiscountApplied(null); }}
                error={!!discountError} helperText={discountError}
              />
              <Button variant="outlined" onClick={handleApplyDiscount} sx={{ minWidth: 100 }}>Apply</Button>
            </Box>
            {discountApplied && <Alert severity="success">Discount applied! You saved ${safeNum(discountAmount).toFixed(2)}</Alert>}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 80, border: `1px solid ${tokens.colors.stone200}` }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Order Summary</Typography>
            <Divider sx={{ mb: 2 }} />
            {cartProducts.map((item) => (
              <Box key={item.productId} sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: tokens.colors.stone700 }}>{item.name}</Typography>
                <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>{item.quantity} × ${safeNum(item.price).toFixed(2)}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>Subtotal</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>${safeNum(subtotal).toFixed(2)}</Typography>
            </Box>
            {discountApplied && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="success.main">Discount</Typography>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>-${safeNum(discountAmount).toFixed(2)}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>Shipping</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Rubik", sans-serif', color: tokens.colors.gold700 }}>
                ${safeNum(total).toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained" color="secondary" fullWidth size="large" onClick={handleCheckout} disabled={loading}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <PaymentIcon />}
              sx={{
                py: 1.5, background: tokens.gradients.gold, color: '#FFFFFF', fontSize: '1rem',
                boxShadow: tokens.shadows.gold,
                '&:hover': { boxShadow: tokens.shadows.goldHover },
              }}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
