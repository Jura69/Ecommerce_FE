import { Box, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  ShoppingBagOutlined,
  LocalShippingOutlined,
  SupportAgentOutlined,
  VerifiedOutlined,
  ArrowForward,
} from '@mui/icons-material';
import { useAuthStore } from '../store';
import { tokens } from '../theme/theme';

const FEATURES = [
  { icon: <ShoppingBagOutlined />, title: 'Curated Products', desc: 'Hand-picked selections for quality-conscious shoppers' },
  { icon: <LocalShippingOutlined />, title: 'Fast Delivery', desc: 'Free shipping on orders over $50, delivered in 2-3 days' },
  { icon: <SupportAgentOutlined />, title: '24/7 Support', desc: 'Our team is always here to help with any questions' },
  { icon: <VerifiedOutlined />, title: 'Secure Checkout', desc: 'Industry-leading encryption for safe transactions' },
];

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: tokens.colors.gold600,
            fontWeight: 700,
            letterSpacing: '0.1em',
            mb: 2,
            display: 'block',
          }}
        >
          WELCOME{user ? `, ${user.name?.toUpperCase()}` : ' TO SHOPSPHERE'}
        </Typography>

        <Typography
          variant="h1"
          sx={{
            mb: 2,
            color: tokens.colors.stone900,
            maxWidth: 720,
            mx: 'auto',
          }}
        >
          Discover{' '}
          <Box
            component="span"
            sx={{
              background: tokens.gradients.gold,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Premium
          </Box>{' '}
          Products
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: tokens.colors.stone500,
            mb: 5,
            maxWidth: 560,
            mx: 'auto',
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Explore a curated marketplace of electronics, fashion, and lifestyle products with unbeatable deals.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              background: tokens.gradients.gold,
              color: '#FFFFFF',
              boxShadow: tokens.shadows.gold,
              '&:hover': { boxShadow: tokens.shadows.goldHover },
            }}
          >
            Browse Products
          </Button>
          <Button
            component={Link}
            to="/dashboard"
            variant="outlined"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
          >
            Seller Dashboard
          </Button>
        </Box>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={3}>
          {FEATURES.map((f, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Box
                className="fade-in-up"
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: `1px solid ${tokens.colors.stone200}`,
                  bgcolor: tokens.colors.white,
                  textAlign: 'center',
                  transition: 'all 0.25s ease',
                  cursor: 'default',
                  height: '100%',
                  '&:hover': {
                    borderColor: tokens.colors.gold300,
                    boxShadow: tokens.shadows.gold,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    bgcolor: tokens.colors.gold50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    '& svg': { color: tokens.colors.gold600, fontSize: 28 },
                  }}
                >
                  {f.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.05rem' }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" sx={{ color: tokens.colors.stone500, lineHeight: 1.5 }}>
                  {f.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
