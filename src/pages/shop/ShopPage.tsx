import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Typography, Box, Grid, Avatar, Chip, Divider, Pagination,
} from '@mui/material';
import { StorefrontOutlined } from '@mui/icons-material';
import { LoadingSpinner, ErrorDisplay, EmptyState, ProductCard } from '../../components/common';
import { useCartStore } from '../../store';
import { tokens } from '../../theme/theme';
import axiosInstance from '../../services/api/axios';
import { Product } from '../../types';

interface ShopInfo {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    description?: string;
    status: string;
    productCount: number;
    createdAt: string;
}

export default function ShopPage() {
    const { shopId } = useParams<{ shopId: string }>();
    const { addToCart } = useCartStore();

    const [shop, setShop] = useState<ShopInfo | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShop = async () => {
            try {
                setLoading(true);
                const [profileRes, productsRes] = await Promise.all([
                    axiosInstance.get(`/shop/profile/${shopId}`),
                    axiosInstance.get(`/shop/${shopId}/products?page=${page}&limit=12`),
                ]);
                setShop((profileRes as any)?.metadata || null);
                const prodData = (productsRes as any)?.metadata;
                setProducts(prodData?.products || []);
                setTotal(prodData?.total || 0);
                setTotalPages(prodData?.totalPages || 1);
            } catch (err: any) {
                setError(err.message || 'Failed to load shop');
            } finally {
                setLoading(false);
            }
        };
        if (shopId) fetchShop();
    }, [shopId, page]);

    const handleAddToCart = async (product: Product) => {
        try { await addToCart(product._id, 1); } catch { }
    };

    if (loading) return <LoadingSpinner message="Loading shop..." />;
    if (error) return <ErrorDisplay error={error} />;
    if (!shop) return <EmptyState title="Shop not found" />;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Shop Header */}
            <Box
                sx={{
                    display: 'flex', alignItems: 'center', gap: 3, p: 4, mb: 4,
                    borderRadius: '20px', border: `1px solid ${tokens.colors.stone200}`,
                    bgcolor: tokens.colors.white,
                }}
            >
                <Avatar
                    src={shop.avatar}
                    sx={{ width: 80, height: 80, bgcolor: tokens.colors.gold100, color: tokens.colors.gold700 }}
                >
                    <StorefrontOutlined sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: tokens.colors.stone900 }}>
                        {shop.name}
                    </Typography>
                    {shop.description && (
                        <Typography variant="body2" sx={{ color: tokens.colors.stone500, mt: 0.5 }}>
                            {shop.description}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                        <Chip label={`${shop.productCount} Products`} size="small" sx={{ bgcolor: tokens.colors.gold50, color: tokens.colors.gold700, fontWeight: 600 }} />
                        <Chip label={shop.status} size="small" color={shop.status === 'active' ? 'success' : 'default'} />
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Products */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Products ({total})
            </Typography>

            {products.length === 0 ? (
                <EmptyState title="No products" description="This shop hasn't listed any products yet." />
            ) : (
                <>
                    <Grid container spacing={2.5}>
                        {products.map((product) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
                                <ProductCard product={product} onAddToCart={handleAddToCart} />
                            </Grid>
                        ))}
                    </Grid>
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
}
