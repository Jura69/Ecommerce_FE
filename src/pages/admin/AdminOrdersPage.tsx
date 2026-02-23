import { useEffect, useState } from 'react';
import {
    Container, Typography, Box, Paper, Table, TableHead, TableBody,
    TableRow, TableCell, TableContainer, Chip, Pagination, MenuItem, TextField,
} from '@mui/material';
import { LoadingSpinner } from '../../components/common';
import { adminService } from '../../services/api/adminService';
import { tokens } from '../../theme/theme';

const ORDER_STATUSES = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await adminService.getAllOrders({ page, limit: 20, status: status !== 'all' ? status : undefined });
                const data = (res as any)?.metadata;
                setOrders(data?.orders || []);
                setTotal(data?.total || 0);
                setTotalPages(data?.totalPages || 1);
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        fetch();
    }, [page, status]);

    const statusColor = (s: string) => {
        const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
            pending: 'warning', confirmed: 'info', shipped: 'info', delivered: 'success', cancelled: 'error',
        };
        return map[s] || 'default';
    };

    if (loading && orders.length === 0) return <LoadingSpinner />;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>All Orders</Typography>
                    <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>{total} orders total</Typography>
                </Box>
                <TextField select size="small" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    sx={{ minWidth: 140 }}
                >
                    {ORDER_STATUSES.map((s) => <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>)}
                </TextField>
            </Box>

            <TableContainer component={Paper} sx={{ border: `1px solid ${tokens.colors.stone200}` }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: tokens.colors.stone50 }}>
                            <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((o: any) => (
                            <TableRow key={o._id} hover>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                    {o._id?.slice(-8).toUpperCase()}
                                </TableCell>
                                <TableCell>{o.order_products?.length || 0} item(s)</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    ${o.order_checkout?.totalPrice?.toLocaleString() || 0}
                                </TableCell>
                                <TableCell>
                                    <Chip label={o.order_status} size="small" color={statusColor(o.order_status)} />
                                </TableCell>
                                <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
                </Box>
            )}
        </Container>
    );
}
