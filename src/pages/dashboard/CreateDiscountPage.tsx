import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Box, Grid,
    MenuItem, Alert, Divider, Paper, CircularProgress, InputAdornment,
} from '@mui/material';
import { ArrowBack, Save, LocalOffer, CalendarMonth } from '@mui/icons-material';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { tokens } from '../../theme/theme';
import axiosInstance from '../../services/api/axios';

interface DiscountFormData {
    name: string;
    code: string;
    description: string;
    type: string;
    value: string;
    min_order_value: string;
    max_uses: string;
    max_uses_per_user: string;
    start_date: string;
    end_date: string;
    applies_to: string;
}

export default function CreateDiscountPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { handleSubmit, control, formState: { errors } } = useForm<DiscountFormData & FieldValues>({
        defaultValues: {
            name: '', code: '', description: '', type: 'percentage', value: '',
            min_order_value: '0', max_uses: '100', max_uses_per_user: '1',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '', applies_to: 'all',
        },
    });

    const onSubmit = async (data: DiscountFormData) => {
        try {
            setLoading(true); setError(null);
            await axiosInstance.post('/discount', {
                discount_name: data.name, discount_code: data.code, discount_description: data.description,
                discount_type: data.type, discount_value: Number(data.value),
                discount_min_order_value: Number(data.min_order_value), discount_max_uses: Number(data.max_uses),
                discount_max_uses_per_user: Number(data.max_uses_per_user),
                discount_start_date: new Date(data.start_date).toISOString(),
                discount_end_date: new Date(data.end_date).toISOString(),
                discount_applies_to: data.applies_to, discount_is_active: true,
            });
            navigate('/dashboard/discounts');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to create discount');
        } finally { setLoading(false); }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard/discounts')} sx={{ mb: 3, color: tokens.colors.stone500 }}>
                Back to Discounts
            </Button>
            <Paper sx={{ p: { xs: 3, sm: 5 }, border: `1px solid ${tokens.colors.stone200}`, borderRadius: '20px' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Create Discount Code</Typography>
                <Typography variant="body2" sx={{ color: tokens.colors.stone500, mb: 4 }}>
                    Set up a new promotional discount for your customers
                </Typography>
                {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>{error}</Alert>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="name" control={control} rules={{ required: 'Name required' }}
                                render={({ field }) => <TextField {...field} label="Discount Name" fullWidth error={!!errors.name} helperText={errors.name?.message as string} />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="code" control={control} rules={{ required: 'Code required' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Discount Code" fullWidth error={!!errors.code} helperText={errors.code?.message as string}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><LocalOffer sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller name="description" control={control}
                                render={({ field }) => <TextField {...field} label="Description" fullWidth multiline rows={2} />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="type" control={control}
                                render={({ field }) => (
                                    <TextField {...field} select label="Discount Type" fullWidth>
                                        <MenuItem value="percentage">Percentage (%)</MenuItem>
                                        <MenuItem value="fixed_amount">Fixed Amount ($)</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="value" control={control} rules={{ required: 'Value required' }}
                                render={({ field }) => <TextField {...field} label="Discount Value" type="number" fullWidth error={!!errors.value} helperText={errors.value?.message as string} />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller name="min_order_value" control={control}
                                render={({ field }) => <TextField {...field} label="Min Order Value" type="number" fullWidth />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller name="max_uses" control={control}
                                render={({ field }) => <TextField {...field} label="Max Uses" type="number" fullWidth />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller name="max_uses_per_user" control={control}
                                render={({ field }) => <TextField {...field} label="Max Per User" type="number" fullWidth />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="start_date" control={control} rules={{ required: 'Start date required' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonth sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="end_date" control={control} rules={{ required: 'End date required' }}
                                render={({ field }) => (
                                    <TextField {...field} label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonth sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller name="applies_to" control={control}
                                render={({ field }) => (
                                    <TextField {...field} select label="Applies To" fullWidth>
                                        <MenuItem value="all">All Products</MenuItem>
                                        <MenuItem value="specific">Specific Products</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 4 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate('/dashboard/discounts')} sx={{ px: 4 }}>Cancel</Button>
                        <Button type="submit" variant="contained" color="secondary" disabled={loading} startIcon={!loading && <Save />}
                            sx={{ px: 4, background: tokens.gradients.gold, color: '#fff', boxShadow: tokens.shadows.gold, '&:hover': { boxShadow: tokens.shadows.goldHover } }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Discount'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}
