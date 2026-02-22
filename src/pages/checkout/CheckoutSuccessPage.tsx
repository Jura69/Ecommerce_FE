import { useLocation, Link } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { tokens } from '../../theme/theme';

interface OrderState {
  orderId?: string;
  [key: string]: any;
}

interface LocationState {
  order?: OrderState;
}

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const order = (location.state as LocationState)?.order;

  if (!order) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ mb: 2, color: tokens.colors.stone700 }}>Order not found</Typography>
        <Button component={Link} to="/" variant="contained">Go Home</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', py: 4 }}>
      <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', border: `1px solid ${tokens.colors.stone200}`, borderRadius: '20px' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: tokens.colors.successBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 44, color: tokens.colors.success }} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: tokens.colors.stone900 }}>
          Order Placed!
        </Typography>
        <Typography variant="body1" sx={{ color: tokens.colors.stone500, mb: 4, maxWidth: 400, mx: 'auto' }}>
          Thank you for your purchase. Your order has been received and is being processed.
        </Typography>

        {order.orderId && (
          <Box sx={{ mb: 4, p: 2, bgcolor: tokens.colors.stone100, borderRadius: '12px', display: 'inline-block' }}>
            <Typography variant="body2" sx={{ color: tokens.colors.stone500, mb: 0.5 }}>Order ID</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'monospace', color: tokens.colors.stone900 }}>
              {order.orderId}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {order.orderId && (
            <Button
              component={Link} to={`/orders/${order.orderId}`} variant="contained" color="secondary"
              sx={{ background: tokens.gradients.gold, color: '#FFFFFF', boxShadow: tokens.shadows.gold }}
            >
              View Order Details
            </Button>
          )}
          <Button component={Link} to="/orders" variant="outlined">My Orders</Button>
          <Button component={Link} to="/products" variant="outlined" startIcon={<ShoppingBagOutlinedIcon />}>
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
