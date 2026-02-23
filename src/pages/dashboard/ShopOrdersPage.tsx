import { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    Chip,
    Button,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { shopDashboardService } from '../../services/api/shopDashboardService';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, 'default' | 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
    pending: 'warning',
    confirmed: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error',
};

const NEXT_STATUS: Record<string, string> = {
    pending: 'confirmed',
    confirmed: 'shipped',
    shipped: 'delivered',
};

export default function ShopOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusTab, setStatusTab] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const currentStatus = STATUS_TABS[statusTab];

    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await shopDashboardService.getMyOrders({
                status: currentStatus !== 'all' ? currentStatus : undefined,
                page,
                limit: 10,
            });
            const data = response?.metadata;
            if (data) {
                setOrders(data.orders || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [currentStatus, page]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleStatusUpdate = async (orderId: string) => {
        const order = orders.find((o) => o._id === orderId);
        if (!order) return;
        const next = NEXT_STATUS[order.order_status];
        if (!next) return;

        try {
            await shopDashboardService.updateOrderStatus(orderId, next);
            loadOrders();
        } catch (err: any) {
            setError(err?.message || 'Failed to update status');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Shop Orders
            </Typography>

            <Tabs
                value={statusTab}
                onChange={(_, v) => { setStatusTab(v); setPage(1); }}
                variant="scrollable"
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
            ) : orders.length === 0 ? (
                <Alert severity="info">No orders found</Alert>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                            {order._id?.slice(-8)}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.order_status}
                                                color={STATUS_COLORS[order.order_status] || 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            ${order.order_checkout?.totalPrice?.toFixed(2) || '0.00'}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.createdOn || order.createdAt || '').toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="center">
                                            {NEXT_STATUS[order.order_status] && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleStatusUpdate(order._id)}
                                                >
                                                    → {NEXT_STATUS[order.order_status]}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

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
