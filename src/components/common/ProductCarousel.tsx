import { Box, Typography, Grid, Skeleton } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Product } from '../../types';
import { tokens } from '../../theme/theme';

interface ProductCarouselProps {
    title: string;
    subtitle?: string;
    products: Product[];
    loading?: boolean;
    viewAllLink?: string;
    onAddToCart?: (product: Product) => void;
}

export default function ProductCarousel({
    title,
    subtitle,
    products,
    loading = false,
    viewAllLink,
    onAddToCart,
}: ProductCarouselProps) {
    return (
        <Box sx={{ mb: 6 }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: tokens.colors.stone900 }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" sx={{ color: tokens.colors.stone500, mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {viewAllLink && (
                    <Box
                        component={Link}
                        to={viewAllLink}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: tokens.colors.gold600,
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: tokens.colors.gold700,
                                gap: 1,
                            },
                        }}
                    >
                        View All <ArrowForward sx={{ fontSize: 18 }} />
                    </Box>
                )}
            </Box>

            {/* Product Grid */}
            <Grid container spacing={2.5}>
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <Skeleton variant="rounded" height={320} sx={{ borderRadius: '16px' }} />
                        </Grid>
                    ))
                    : products.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
                            <ProductCard
                                product={product}
                                onAddToCart={onAddToCart}
                                showDescription={false}
                                showStock={false}
                                imageHeight={180}
                            />
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
}
