import { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    Button,
    Grid,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import useOrderStore from '../../store/orderStore';
import OrderCard from '../../components/common/OrderCard';
import EmptyState from '../../components/common/EmptyState';

const STATUS_TABS = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
];

export default function OrdersPage() {
    const {
        orders,
        loading,
        error,
        statusFilter,
        fetchOrders,
        setStatusFilter,
        clearError,
    } = useOrderStore();

    const [tabIndex, setTabIndex] = useState(0);

    const loadOrders = useCallback(
        (status: string) => {
            fetchOrders(status);
        },
        [fetchOrders]
    );

    useEffect(() => {
        loadOrders(statusFilter);
    }, [loadOrders, statusFilter]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
        const newStatus = STATUS_TABS[newValue].value;
        setStatusFilter(newStatus);
        loadOrders(newStatus);
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                    My Orders
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => loadOrders(statusFilter)}
                    disabled={loading}
                    size="small"
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                    {error}
                </Alert>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 48,
                        },
                    }}
                >
                    {STATUS_TABS.map((tab) => (
                        <Tab key={tab.value} label={tab.label} />
                    ))}
                </Tabs>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && orders.length === 0 && (
                <EmptyState
                    title="No orders found"
                    description={
                        statusFilter === 'all'
                            ? "You haven't placed any orders yet"
                            : `No ${statusFilter} orders`
                    }
                />
            )}

            {!loading && orders.length > 0 && (
                <Grid container spacing={2}>
                    {orders.map((order) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order._id}>
                            <OrderCard order={order} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
