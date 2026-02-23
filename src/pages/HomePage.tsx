import { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  ShoppingBagOutlined,
  LocalShippingOutlined,
  SupportAgentOutlined,
  VerifiedOutlined,
  ArrowForward,
} from '@mui/icons-material';
import { useAuthStore, useCartStore } from '../store';
import { tokens } from '../theme/theme';
import { productService } from '../services/api';
import { categoryService, CategoryData } from '../services/api/categoryService';
import ProductCarousel from '../components/common/ProductCarousel';
import CategoryCard from '../components/common/CategoryCard';
import { Product } from '../types';

const FEATURES = [
  { icon: <ShoppingBagOutlined />, title: 'Curated Products', desc: 'Hand-picked selections for quality shoppers' },
  { icon: <LocalShippingOutlined />, title: 'Fast Delivery', desc: 'Free shipping on orders over $50' },
  { icon: <SupportAgentOutlined />, title: '24/7 Support', desc: 'Always here to help with questions' },
  { icon: <VerifiedOutlined />, title: 'Secure Checkout', desc: 'Industry-leading encryption' },
];

export default function HomePage() {
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();

  const [featured, setFeatured] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, trendingRes, catRes] = await Promise.all([
          productService.getFeaturedProducts(8),
          productService.getTrendingProducts(8),
          categoryService.getCategoryTree(),
        ]);
        setFeatured((featuredRes as any)?.metadata || []);
        setTrending((trendingRes as any)?.metadata || []);
        // Flatten top-level categories only
        const tree = (catRes as any)?.metadata || [];
        setCategories(tree.slice(0, 6));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoadingFeatured(false);
        setLoadingTrending(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
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
          sx={{ mb: 2, color: tokens.colors.stone900, maxWidth: 720, mx: 'auto' }}
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
      <Box sx={{ py: { xs: 4, md: 6 } }}>
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

      <Divider sx={{ my: 2 }} />

      {/* Categories Section */}
      {categories.length > 0 && (
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: tokens.colors.stone900 }}>
                Shop by Category
              </Typography>
              <Typography variant="body2" sx={{ color: tokens.colors.stone500, mt: 0.5 }}>
                Browse our curated collection of categories
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2.5}>
            {categories.map((cat) => (
              <Grid size={{ xs: 6, sm: 4, md: 2 }} key={cat._id}>
                <CategoryCard
                  id={cat._id}
                  name={cat.category_name}
                  icon={cat.category_icon}
                  slug={cat.category_slug}
                  productCount={cat.category_productCount}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Featured Products */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <ProductCarousel
          title="Featured Products"
          subtitle="Top-rated picks handpicked for you"
          products={featured}
          loading={loadingFeatured}
          viewAllLink="/products?sort=rating"
          onAddToCart={handleAddToCart}
        />
      </Box>

      {/* Trending Products */}
      <Box sx={{ py: { xs: 2, md: 4 } }}>
        <ProductCarousel
          title="New Arrivals"
          subtitle="Fresh products just added to the marketplace"
          products={trending}
          loading={loadingTrending}
          viewAllLink="/products?sort=newest"
          onAddToCart={handleAddToCart}
        />
      </Box>

      {/* CTA Banner */}
      <Box
        sx={{
          mt: 4,
          mb: 6,
          p: { xs: 4, md: 6 },
          borderRadius: '20px',
          background: tokens.gradients.warmDark,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(202, 138, 4, 0.15)',
          }}
        />
        <Typography
          variant="h3"
          sx={{ color: '#FFFFFF', mb: 2, position: 'relative' }}
        >
          Start Selling Today
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: tokens.colors.stone400, mb: 4, maxWidth: 480, mx: 'auto', position: 'relative' }}
        >
          Join thousands of sellers on ShopSphere and reach millions of customers worldwide.
        </Typography>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          color="secondary"
          size="large"
          endIcon={<ArrowForward />}
          sx={{
            px: 5,
            py: 1.5,
            fontSize: '1rem',
            background: tokens.gradients.gold,
            color: '#FFFFFF',
            boxShadow: tokens.shadows.gold,
            position: 'relative',
            '&:hover': { boxShadow: tokens.shadows.goldHover },
          }}
        >
          Open Your Shop
        </Button>
      </Box>
    </Box>
  );
}
