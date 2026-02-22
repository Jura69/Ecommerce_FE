import { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
} from '@mui/material';
import { useCartStore } from '../../store';
import {
  LoadingSpinner,
  ErrorDisplay,
  EmptyState,
  OrderSummary,
  CartItem,
} from '../../components/common';

function CartPage() {
  const {
    cart,
    loading,
    error,
    fetchCart,
    removeFromCart,
    updateItemQuantity,
    getCartItemCount,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateItemQuantity(productId, newQuantity);
    }
  };

  const totalItems = getCartItemCount();
  const cartProducts = cart?.cart_products || [];
  const cartTotal = cartProducts.reduce(
    (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  if (loading && !cart) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ErrorDisplay error={error} onRetry={fetchCart} />
      </Container>
    );
  }

  if (!cart || cartProducts.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <EmptyState
          title="Your cart is empty"
          actionLabel="Go Shopping"
          actionPath="/products"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart ({totalItems} items)
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {cartProducts.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={removeFromCart}
            />
          ))}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <OrderSummary
            items={cartProducts.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            }))}
            subtotal={cartTotal}
            total={cartTotal}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default CartPage;

