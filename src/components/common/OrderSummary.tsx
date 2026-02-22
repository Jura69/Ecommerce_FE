import { Paper, Typography, Box, Divider, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../../theme/theme';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  items?: OrderItem[];
  subtotal: number;
  discount?: number;
  shipping?: number;
  total?: number;
  checkoutPath?: string;
  checkoutLabel?: string;
  showCheckout?: boolean;
}

export default function OrderSummary({
  items,
  subtotal,
  discount = 0,
  shipping = 0,
  total,
  checkoutPath = '/checkout',
  checkoutLabel = 'Proceed to Checkout',
  showCheckout = true,
}: OrderSummaryProps) {
  const safeNum = (v: any) => (typeof v === 'number' && !isNaN(v) ? v : 0);
  const finalTotal = safeNum(subtotal) - safeNum(discount) + safeNum(shipping);

  return (
    <Paper sx={{ p: 3, position: 'sticky', top: 80, border: `1px solid ${tokens.colors.stone200}` }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: tokens.colors.stone900 }}>
        Order Summary
      </Typography>
      <Divider sx={{ my: 2 }} />
      {items && items.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {items.map((item, index) => (
            <Box key={index} sx={{ mb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: tokens.colors.stone700 }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>
                {item.quantity} × ${safeNum(item.price).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>Subtotal</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>${safeNum(subtotal).toFixed(2)}</Typography>
      </Box>
      {discount > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="success.main">Discount</Typography>
          <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>-${safeNum(discount).toFixed(2)}</Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>Shipping</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {safeNum(shipping) === 0 ? 'Free' : `$${safeNum(shipping).toFixed(2)}`}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontFamily: '"Rubik", sans-serif', color: tokens.colors.gold700 }}
        >
          ${safeNum(total || finalTotal).toFixed(2)}
        </Typography>
      </Box>
      {showCheckout && (
        <Button
          component={Link}
          to={checkoutPath}
          variant="contained"
          color="secondary"
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            background: tokens.gradients.gold,
            color: '#FFFFFF',
            fontSize: '1rem',
            boxShadow: tokens.shadows.gold,
            '&:hover': { boxShadow: tokens.shadows.goldHover },
          }}
        >
          {checkoutLabel}
        </Button>
      )}
    </Paper>
  );
}
