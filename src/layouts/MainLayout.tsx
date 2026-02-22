import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Container,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Avatar,
} from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useCartStore, useAuthStore } from '../store';
import { tokens } from '../theme/theme';

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Notifications', path: '/notifications', icon: <NotificationsIcon /> },
  { label: 'Orders', path: '/orders', icon: <ReceiptLongIcon /> },
  { label: 'Wishlist', path: '/wishlist', icon: <FavoriteIcon /> },
  { label: 'Settings', path: '/settings/profile', icon: <SettingsIcon /> },
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
];

function MainLayout() {
  const { getCartItemCount } = useCartStore();
  const { user } = useAuthStore();
  const itemCount = getCartItemCount();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: tokens.shadows.sm,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, gap: 1 }}>
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: 'text.primary', mr: 1 }}
                aria-label="open navigation menu"
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                mr: 'auto',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: tokens.gradients.gold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: tokens.shadows.gold,
                }}
              >
                <StorefrontIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Rubik", sans-serif',
                  fontWeight: 700,
                  color: tokens.colors.stone900,
                  letterSpacing: '-0.02em',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                ShopSphere
              </Typography>
            </Box>

            {/* Desktop nav links */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {NAV_ITEMS.map((item) => (
                  <IconButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    aria-label={item.label}
                    sx={{
                      color: isActive(item.path) ? tokens.colors.gold600 : tokens.colors.stone500,
                      borderRadius: '10px',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: tokens.colors.stone900,
                        bgcolor: 'rgba(28, 25, 23, 0.04)',
                      },
                      ...(isActive(item.path) && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 16,
                          height: 3,
                          borderRadius: 2,
                          background: tokens.gradients.gold,
                        },
                      }),
                    }}
                  >
                    {item.icon}
                  </IconButton>
                ))}
              </Box>
            )}

            {/* Cart + Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              <IconButton
                component={Link}
                to="/cart"
                aria-label="shopping cart"
                sx={{
                  color: isActive('/cart') ? tokens.colors.gold600 : tokens.colors.stone500,
                  borderRadius: '10px',
                  '&:hover': {
                    color: tokens.colors.stone900,
                    bgcolor: 'rgba(28, 25, 23, 0.04)',
                  },
                }}
              >
                <Badge
                  badgeContent={itemCount}
                  sx={{
                    '& .MuiBadge-badge': {
                      background: tokens.gradients.gold,
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      minWidth: 18,
                      height: 18,
                    },
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {user && (
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: tokens.colors.stone200,
                    color: tokens.colors.stone700,
                    fontFamily: '"Rubik", sans-serif',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    ml: 0.5,
                    cursor: 'pointer',
                    border: `2px solid ${tokens.colors.stone200}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: tokens.colors.gold500,
                    },
                  }}
                  component={Link}
                  to="/settings/profile"
                >
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: tokens.gradients.gold,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StorefrontIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
            </Box>
            <Typography variant="h6" sx={{ fontFamily: '"Rubik", sans-serif', fontWeight: 700, fontSize: '1rem' }}>
              ShopSphere
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ p: 1 }}>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: '10px',
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: tokens.colors.gold50,
                    color: tokens.colors.gold700,
                    '& .MuiListItemIcon-root': {
                      color: tokens.colors.gold600,
                    },
                  },
                  '&:hover': {
                    bgcolor: tokens.colors.stone100,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: tokens.colors.stone500 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9375rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
          bgcolor: tokens.colors.white,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} ShopSphere. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default MainLayout;
