import { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Box,
    CircularProgress,
    Alert,
    Pagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link } from 'react-router-dom';
import { wishlistService, WishlistItem } from '../../services/api/wishlistService';
import { useCartStore } from '../../store';
import { EmptyState } from '../../components/common';

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { addToCart } = useCartStore();

    const loadWishlist = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await wishlistService.getWishlist({ page, limit: 12 });
            const data = response?.metadata;
            if (data) {
                setItems(data.items || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadWishlist();
    }, [loadWishlist]);

    const handleRemove = async (productId: string) => {
        try {
            await wishlistService.removeFromWishlist(productId);
            setItems((prev) => prev.filter((i) => i.wishlist_productId?._id !== productId));
        } catch (err: any) {
            setError(err?.message || 'Failed to remove');
        }
    };

    const handleAddToCart = async (productId: string, shopId: string, productInfo?: { name?: string; price?: number; thumb?: string }) => {
        try {
            await addToCart(productId, 1, shopId, productInfo);
        } catch (err) {
            console.error('Failed to add to cart:', err);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                My Wishlist
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : items.length === 0 ? (
                <EmptyState
                    title="Your wishlist is empty"
                    description="Browse products and click the heart icon to save them here"
                />
            ) : (
                <>
                    <Grid container spacing={2}>
                        {items.map((item) => {
                            const product = item.wishlist_productId;
                            if (!product) return null;
                            return (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item._id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardMedia
                                            component={Link}
                                            to={`/products/${product._id}`}
                                            image={product.product_thumb || '/placeholder.png'}
                                            sx={{ height: 160, objectFit: 'contain', p: 1 }}
                                        />
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography
                                                variant="subtitle2"
                                                component={Link}
                                                to={`/products/${product._id}`}
                                                sx={{ textDecoration: 'none', color: 'inherit' }}
                                                noWrap
                                            >
                                                {product.product_name}
                                            </Typography>
                                            <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
                                                ${product.product_price}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                            <Button
                                                size="small"
                                                startIcon={<AddShoppingCartIcon />}
                                                onClick={() => handleAddToCart(product._id, (product as any).product_shop?._id || '', {
                                                    name: product.product_name,
                                                    price: product.product_price,
                                                    thumb: product.product_thumb,
                                                })}
                                            >
                                                Add to Cart
                                            </Button>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemove(product._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
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
