import { Paper, Typography, Box, Divider, Button } from '@mui/material';
import { Link } from 'react-router-dom';

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
  const finalTotal = subtotal - discount + shipping;

  return (
    <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Divider sx={{ my: 2 }} />
      {items && items.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {items.map((item, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.quantity} × ${item.price.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Subtotal</Typography>
        <Typography>${subtotal.toFixed(2)}</Typography>
      </Box>
      {discount > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="success.main">Discount</Typography>
          <Typography color="success.main">-${discount.toFixed(2)}</Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Shipping</Typography>
        <Typography>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">${(total || finalTotal).toFixed(2)}</Typography>
      </Box>
      {showCheckout && (
        <Button
          component={Link}
          to={checkoutPath}
          variant="contained"
          fullWidth
          size="large"
        >
          {checkoutLabel}
        </Button>
      )}
    </Paper>
  );
}

