import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Box, Grid, MenuItem,
    CircularProgress, Alert, InputAdornment, Divider, Paper,
} from '@mui/material';
import {
    ArrowBack, Save, Image, Description, AttachMoney, Inventory, Category,
} from '@mui/icons-material';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { productService } from '../../services/api';
import { tokens } from '../../theme/theme';
import { LoadingSpinner } from '../../components/common';

const productTypes = [
    { value: 'Electronics', label: 'Electronics', icon: '📱' },
    { value: 'Clothing', label: 'Clothing', icon: '👕' },
];

interface ProductFormData {
    product_name: string;
    product_thumb: string;
    product_description: string;
    product_price: string;
    product_quantity: string;
    product_type: string;
    product_attributes: Record<string, any>;
}

export default function EditProductPage() {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { handleSubmit, control, reset, formState: { errors } } = useForm<ProductFormData & FieldValues>({
        defaultValues: {
            product_name: '', product_thumb: '', product_description: '',
            product_price: '', product_quantity: '', product_type: 'Electronics',
            product_attributes: {},
        },
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productService.getProductById(productId!);
                const p = (res as any)?.metadata;
                if (p) {
                    reset({
                        product_name: p.product_name || '',
                        product_thumb: p.product_thumb || '',
                        product_description: p.product_description || '',
                        product_price: String(p.product_price || ''),
                        product_quantity: String(p.product_quantity || ''),
                        product_type: p.product_type || 'Electronics',
                        product_attributes: p.product_attributes || {},
                    });
                }
            } catch (err: any) {
                setError('Failed to load product');
            } finally {
                setFetching(false);
            }
        };
        if (productId) fetchProduct();
    }, [productId, reset]);

    const onSubmit = async (data: ProductFormData) => {
        try {
            setLoading(true);
            setError(null);
            await productService.updateProduct(productId!, {
                ...data,
                product_price: Number(data.product_price),
                product_quantity: Number(data.product_quantity),
            });
            navigate(`/products/${productId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update product.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <LoadingSpinner message="Loading product..." />;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3, color: tokens.colors.stone500 }}>
                Back
            </Button>
            <Paper sx={{ p: { xs: 3, sm: 5 }, border: `1px solid ${tokens.colors.stone200}`, borderRadius: '20px' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: tokens.colors.stone900 }}>
                    Edit Product
                </Typography>
                <Typography variant="body2" sx={{ color: tokens.colors.stone500, mb: 4 }}>
                    Update the product details below
                </Typography>
                {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>{error}</Alert>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Controller name="product_name" control={control} rules={{ required: 'Product name is required' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Product Name" fullWidth error={!!errors.product_name} helperText={errors.product_name?.message as string}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><Description sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller name="product_thumb" control={control} rules={{ required: 'Thumbnail URL is required' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Thumbnail URL" fullWidth error={!!errors.product_thumb} helperText={errors.product_thumb?.message as string}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><Image sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller name="product_description" control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Description" fullWidth multiline rows={4} value={field.value || ''} InputLabelProps={{ shrink: true }} />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="product_price" control={control}
                                rules={{ required: 'Price is required' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Price" type="number" fullWidth error={!!errors.product_price} helperText={errors.product_price?.message as string}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="product_quantity" control={control}
                                rules={{ required: 'Quantity is required' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Quantity" type="number" fullWidth error={!!errors.product_quantity} helperText={errors.product_quantity?.message as string}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><Inventory sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller name="product_type" control={control}
                                render={({ field }) => (
                                    <TextField {...field} select label="Product Type" fullWidth
                                        InputProps={{ startAdornment: <InputAdornment position="start"><Category sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                                    >
                                        {productTypes.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <span>{opt.icon}</span> {opt.label}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 4 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ px: 4 }}>Cancel</Button>
                        <Button
                            type="submit" variant="contained" color="secondary" disabled={loading} startIcon={!loading && <Save />}
                            sx={{
                                px: 4, background: tokens.gradients.gold, color: '#FFFFFF',
                                boxShadow: tokens.shadows.gold, '&:hover': { boxShadow: tokens.shadows.goldHover },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}
