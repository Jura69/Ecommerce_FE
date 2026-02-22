import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import NewProductPage from './pages/products/NewProductPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import CheckoutSuccessPage from './pages/checkout/CheckoutSuccessPage';
import NotificationPage from './pages/notifications/NotificationPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import ProfilePage from './pages/settings/ProfilePage';
import AddressPage from './pages/settings/AddressPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ShopOrdersPage from './pages/dashboard/ShopOrdersPage';
import ShopProductsPage from './pages/dashboard/ShopProductsPage';
import WishlistPage from './pages/wishlist/WishlistPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <GuestGuard>
                <LoginPage />
              </GuestGuard>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestGuard>
                <SignupPage />
              </GuestGuard>
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected routes with main layout */}
          <Route
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<NewProductPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/settings/profile" element={<ProfilePage />} />
            <Route path="/settings/addresses" element={<AddressPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/orders" element={<ShopOrdersPage />} />
            <Route path="/dashboard/products" element={<ShopProductsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

