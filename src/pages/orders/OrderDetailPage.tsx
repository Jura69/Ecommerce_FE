import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Divider,
    Button,
    Alert,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import useOrderStore from '../../store/orderStore';
import OrderStatusTimeline from '../../components/common/OrderStatusTimeline';

export default function OrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { currentOrder, loading, error, fetchOrderDetail, cancelOrder, clearError } =
        useOrderStore();

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail(orderId);
        }
    }, [orderId, fetchOrderDetail]);

    const handleCancelOrder = async () => {
        if (!orderId) return;
        setCancelLoading(true);
        const success = await cancelOrder(orderId, cancelReason);
        setCancelLoading(false);
        if (success) {
            setCancelDialogOpen(false);
            setCancelReason('');
        }
    };

    const canCancel =
        currentOrder?.order_status === 'pending' ||
        currentOrder?.order_status === 'confirmed';

    if (loading && !currentOrder) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!currentOrder) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">Order not found</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} sx={{ mt: 2 }}>
                    Back to Orders
                </Button>
            </Container>
        );
    }

    const totalAmount =
        currentOrder.order_checkout.totalCheckout ??
        currentOrder.order_checkout.totalPrice ??
        0;
    const orderDate = currentOrder.createdOn || currentOrder.createdAt;

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/orders')}
                sx={{ mb: 3 }}
            >
                Back to Orders
            </Button>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                    {error}
                </Alert>
            )}

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                        Order #{currentOrder._id.slice(-8).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Placed on {orderDate ? new Date(orderDate).toLocaleString('vi-VN') : '—'}
                    </Typography>
                </Box>
                {canCancel && (
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => setCancelDialogOpen(true)}
                    >
                        Cancel Order
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {/* Left column — Status + Products */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {/* Status Timeline */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Order Status
                        </Typography>
                        <OrderStatusTimeline
                            currentStatus={currentOrder.order_status}
                            statusHistory={currentOrder.order_status_history}
                        />
                    </Paper>

                    {/* Products */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Order Items
                        </Typography>
                        {currentOrder.order_products.map((product, index) => (
                            <Box key={index}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {product.name || `Product ${product.productId.slice(-6)}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Qty: {product.quantity} × {product.price.toLocaleString('vi-VN')}₫
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {(product.price * product.quantity).toLocaleString('vi-VN')}₫
                                    </Typography>
                                </Box>
                                {index < currentOrder.order_products.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Right column — Summary + Shipping */}
                <Grid size={{ xs: 12, md: 4 }}>
                    {/* Order Summary */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Order Summary
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                            <Typography variant="body2">
                                {currentOrder.order_checkout.totalPrice.toLocaleString('vi-VN')}₫
                            </Typography>
                        </Box>
                        {(currentOrder.order_checkout.totalDiscount ?? 0) > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="success.main">Discount</Typography>
                                <Typography variant="body2" color="success.main">
                                    -{(currentOrder.order_checkout.totalDiscount ?? 0).toLocaleString('vi-VN')}₫
                                </Typography>
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">Shipping</Typography>
                            <Typography variant="body2">
                                {(currentOrder.order_checkout.feeShip ?? 0) === 0
                                    ? 'Free'
                                    : `${(currentOrder.order_checkout.feeShip ?? 0).toLocaleString('vi-VN')}₫`}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 1.5 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {totalAmount.toLocaleString('vi-VN')}₫
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Shipping Info */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LocalShippingIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Shipping
                            </Typography>
                        </Box>
                        <Typography variant="body2">
                            {currentOrder.order_shipping.street || '—'}
                        </Typography>
                        <Typography variant="body2">
                            {[currentOrder.order_shipping.city, currentOrder.order_shipping.state]
                                .filter(Boolean)
                                .join(', ') || '—'}
                        </Typography>
                        <Typography variant="body2">
                            {[currentOrder.order_shipping.zipCode, currentOrder.order_shipping.country]
                                .filter(Boolean)
                                .join(', ') || '—'}
                        </Typography>
                    </Paper>

                    {/* Payment Info */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Payment
                        </Typography>
                        <Chip label={currentOrder.order_payment.method || 'COD'} color="default" />
                        {currentOrder.order_trackingNumber && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">Tracking #</Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                    {currentOrder.order_trackingNumber}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Cancel Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Cancel Order</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Are you sure you want to cancel order #{currentOrder._id.slice(-8).toUpperCase()}?
                        This action cannot be undone.
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Reason for cancellation (optional)"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="e.g. Changed my mind, found a better price..."
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setCancelDialogOpen(false)} disabled={cancelLoading}>
                        Keep Order
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancelOrder}
                        disabled={cancelLoading}
                        startIcon={cancelLoading ? <CircularProgress size={16} /> : <CancelIcon />}
                    >
                        {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
