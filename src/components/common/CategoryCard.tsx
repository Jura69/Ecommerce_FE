import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../../theme/theme';

interface CategoryCardProps {
    id: string;
    name: string;
    icon?: string;
    slug?: string;
    productCount?: number;
}

export default function CategoryCard({ id, name, icon, productCount }: CategoryCardProps) {
    return (
        <Box
            component={Link}
            to={`/products?category=${id}`}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                p: 3,
                borderRadius: '16px',
                border: `1px solid ${tokens.colors.stone200}`,
                bgcolor: tokens.colors.white,
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                '&:hover': {
                    borderColor: tokens.colors.gold300,
                    boxShadow: tokens.shadows.gold,
                    transform: 'translateY(-4px)',
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
                    fontSize: 28,
                }}
            >
                {icon || '📦'}
            </Box>
            <Typography
                variant="subtitle2"
                sx={{
                    color: tokens.colors.stone800,
                    textAlign: 'center',
                    fontWeight: 600,
                }}
            >
                {name}
            </Typography>
            {productCount !== undefined && (
                <Typography variant="caption" sx={{ color: tokens.colors.stone400 }}>
                    {productCount} products
                </Typography>
            )}
        </Box>
    );
}
