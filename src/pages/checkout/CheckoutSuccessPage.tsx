import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
} from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

interface OrderState {
  orderId?: string;
  [key: string]: any;
}

interface LocationState {
  order?: OrderState;
}

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = (location.state as LocationState)?.order;

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Order not found
        </Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your purchase. Your order has been received and is being processed.
        </Typography>

        {order.orderId && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Order ID
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {order.orderId}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            startIcon={<ShoppingBagIcon />}
          >
            Continue Shopping
          </Button>
          <Button
            component={Link}
            to="/"
            variant="outlined"
          >
            Go Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

