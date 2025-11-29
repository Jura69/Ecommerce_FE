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
} from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useCartStore } from '../store';

function MainLayout() {
  const { getCartItemCount } = useCartStore();
  const itemCount = getCartItemCount();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
            }}
          >
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              E-Commerce
            </Link>
          </Typography>
          <IconButton
            component={Link}
            to="/"
            color="inherit"
            aria-label="go to home page"
            size="large"
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            component={Link}
            to="/notifications"
            color="inherit"
            aria-label="view notifications"
            size="large"
          >
            <NotificationsIcon />
          </IconButton>
          <IconButton
            component={Link}
            to="/cart"
            color="inherit"
            aria-label="go to shopping cart"
            size="large"
          >
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export default MainLayout;

