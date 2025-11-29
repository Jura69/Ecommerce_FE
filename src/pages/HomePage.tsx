import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Welcome to E-commerce Shop
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Your one-stop shop for all your shopping needs
          </Typography>
        </Box>

        {user && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    Shop Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        {user.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        {user.status || 'Active'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Verified
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={user.verify ? 'Yes' : 'No'}
                          color={user.verify ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    sx={{ mt: 2 }}
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                <ShoppingBagIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Start Shopping
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                  Browse our wide selection of products
                </Typography>
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Browse Products
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}

        {!user && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingBagIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Browse Products
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

