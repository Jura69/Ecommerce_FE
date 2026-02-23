import { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useCartStore } from '../../store';
import {
  LoadingSpinner,
  ErrorDisplay,
  EmptyState,
  OrderSummary,
  CartItem,
} from '../../components/common';
import { tokens } from '../../theme/theme';
import { formatters } from '../../utils';
import { ShopGroup } from '../../types';

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

  const handleQuantityChange = (productId: string, newQuantity: number, skuId?: string, shopId?: string) => {
    if (newQuantity > 0 && shopId) {
      updateItemQuantity(productId, newQuantity, shopId, skuId);
    }
  };

  const totalItems = getCartItemCount();
  const cartShops = cart?.cart_shops || [];
  const cartTotal = cartShops.reduce(
    (total, shop) =>
      total +
      shop.items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      ),
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

  if (!cart || cartShops.length === 0) {
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
          {cartShops.map((shop: ShopGroup) => (
            <ShopCartGroup
              key={shop.shopId}
              shop={shop}
              onQuantityChange={handleQuantityChange}
              onRemove={removeFromCart}
            />
          ))}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <OrderSummary
            items={cartShops.flatMap((shop) =>
              shop.items.map((item) => ({
                name: item.name || 'Unknown Product',
                quantity: item.quantity,
                price: item.price || 0,
              }))
            )}
            subtotal={cartTotal}
            total={cartTotal}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

// ─── Shop Cart Group Component ─────────────────────────────

interface ShopCartGroupProps {
  shop: ShopGroup;
  onQuantityChange: (productId: string, quantity: number, skuId?: string, shopId?: string) => void;
  onRemove: (productId: string, skuId?: string) => void;
}

function ShopCartGroup({ shop, onQuantityChange, onRemove }: ShopCartGroupProps) {
  const shopSubtotal = shop.items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        border: `1px solid ${tokens.colors.stone200}`,
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Shop Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2.5,
          py: 1.5,
          bgcolor: tokens.colors.stone50,
          borderBottom: `1px solid ${tokens.colors.stone200}`,
        }}
      >
        <StorefrontIcon sx={{ color: tokens.colors.gold600, fontSize: 20 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: tokens.colors.stone800 }}>
          {shop.shopName || 'Shop'}
        </Typography>
      </Box>

      {/* Items */}
      <Box sx={{ p: 2 }}>
        {shop.items.map((item, index) => (
          <Box key={`${item.productId}-${item.skuId || 'no-sku'}`}>
            <CartItem
              item={item}
              onQuantityChange={(productId, qty, skuId) =>
                onQuantityChange(productId, qty, skuId, shop.shopId)
              }
              onRemove={onRemove}
            />
            {index < shop.items.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </Box>

      {/* Shop Subtotal */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          px: 2.5,
          py: 1.5,
          bgcolor: tokens.colors.stone50,
          borderTop: `1px solid ${tokens.colors.stone200}`,
        }}
      >
        <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>
          Shop subtotal:{' '}
          <Typography
            component="span"
            sx={{ fontWeight: 700, color: tokens.colors.gold700, fontFamily: '"Rubik", sans-serif' }}
          >
            {formatters.currency(shopSubtotal)}
          </Typography>
        </Typography>
      </Box>
    </Paper>
  );
}

export default CartPage;
