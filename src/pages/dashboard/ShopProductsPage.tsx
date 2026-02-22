import { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Pagination,
    Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { shopDashboardService } from '../../services/api/shopDashboardService';

const STATUS_TABS = ['all', 'published', 'draft'];

export default function ShopProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusTab, setStatusTab] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const currentStatus = STATUS_TABS[statusTab];

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await shopDashboardService.getMyProducts({
                status: currentStatus !== 'all' ? currentStatus : undefined,
                page,
                limit: 12,
            });
            const data = response?.metadata;
            if (data) {
                setProducts(data.products || []);
                setTotalPages(data.totalPages || 1);
                setTotal(data.total || 0);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    }, [currentStatus, page]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    My Products
                </Typography>
                <Button
                    component={Link}
                    to="/products/new"
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    Add Product
                </Button>
            </Box>

            <Tabs
                value={statusTab}
                onChange={(_, v) => { setStatusTab(v); setPage(1); }}
                sx={{ mb: 3 }}
            >
                {STATUS_TABS.map((s) => (
                    <Tab key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} />
                ))}
            </Tabs>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : products.length === 0 ? (
                <Alert severity="info">No products found</Alert>
            ) : (
                <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Showing {products.length} of {total} products
                    </Typography>
                    <Grid container spacing={2}>
                        {products.map((p) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={p._id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={p.product_thumb || '/placeholder.png'}
                                        alt={p.product_name}
                                        sx={{ objectFit: 'contain', p: 1 }}
                                    />
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" noWrap>
                                            {p.product_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ${p.product_price}
                                        </Typography>
                                        <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                                            <Chip
                                                label={p.isPublished ? 'Published' : 'Draft'}
                                                color={p.isPublished ? 'success' : 'default'}
                                                size="small"
                                            />
                                            <Chip label={`Qty: ${p.product_quantity}`} size="small" variant="outlined" />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
}
