import { useEffect, useState } from 'react';
import {
    Container, Typography, Box, Paper, Button, Chip, Table, TableHead,
    TableBody, TableRow, TableCell, TableContainer, IconButton, Tooltip,
} from '@mui/material';
import { Add, Cancel } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { discountService } from '../../services/api/discountService';
import { tokens } from '../../theme/theme';
import { Discount } from '../../types';

export default function DiscountListPage() {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await discountService.getAllDiscountCodes();
                setDiscounts((res as any)?.metadata || []);
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        fetch();
    }, []);

    const isExpired = (d: Discount) => new Date((d as any).discount_end_date) < new Date();

    if (loading) return <LoadingSpinner />;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Discount Codes</Typography>
                    <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>
                        Manage your promotions and discount codes
                    </Typography>
                </Box>
                <Button
                    component={Link} to="/dashboard/discounts/new"
                    variant="contained" color="secondary" startIcon={<Add />}
                    sx={{ background: tokens.gradients.gold, color: '#fff' }}
                >
                    Create Discount
                </Button>
            </Box>

            {discounts.length === 0 ? (
                <EmptyState title="No discounts" description="Create your first discount code to attract customers." />
            ) : (
                <TableContainer component={Paper} sx={{ border: `1px solid ${tokens.colors.stone200}` }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: tokens.colors.stone50 }}>
                                <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Value</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Uses</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {discounts.map((d: any) => (
                                <TableRow key={d._id} hover>
                                    <TableCell>
                                        <Chip label={d.discount_code} size="small"
                                            sx={{ bgcolor: tokens.colors.gold50, color: tokens.colors.gold700, fontWeight: 700, fontFamily: 'monospace' }}
                                        />
                                    </TableCell>
                                    <TableCell>{d.discount_name}</TableCell>
                                    <TableCell>{d.discount_type === 'fixed_amount' ? 'Fixed' : 'Percent'}</TableCell>
                                    <TableCell>
                                        {d.discount_type === 'fixed_amount' ? `$${d.discount_value}` : `${d.discount_value}%`}
                                    </TableCell>
                                    <TableCell>{d.discount_uses_count || 0} / {d.discount_max_uses}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={isExpired(d) ? 'Expired' : d.discount_is_active ? 'Active' : 'Inactive'}
                                            size="small"
                                            color={isExpired(d) ? 'default' : d.discount_is_active ? 'success' : 'error'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {!isExpired(d) && d.discount_is_active && (
                                            <Tooltip title="Deactivate">
                                                <IconButton size="small"><Cancel /></IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}
