import { Box, Card, CardContent, Typography, Divider, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OrderStatusTimeline from './OrderStatusTimeline';
import { Order } from '../../types';

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    const navigate = useNavigate();

    const totalItems = order.order_products.reduce((sum, p) => sum + p.quantity, 0);
    const totalAmount =
        order.order_checkout.totalCheckout ??
        order.order_checkout.totalPrice ??
        0;
    const orderDate = order.createdOn || order.createdAt;

    return (
        <Card
            elevation={1}
            sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                },
            }}
            onClick={() => navigate(`/orders/${order._id}`)}
        >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            Order ID
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                            #{order._id.slice(-8).toUpperCase()}
                        </Typography>
                    </Box>
                    <OrderStatusTimeline currentStatus={order.order_status} compact />
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Products summary */}
                <Box sx={{ mb: 1.5 }}>
                    {order.order_products.slice(0, 3).map((product, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                py: 0.3,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ flex: 1, mr: 2 }}>
                                {product.name || `Product ${product.productId.slice(-6)}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                x{product.quantity}
                            </Typography>
                        </Box>
                    ))}
                    {order.order_products.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                            +{order.order_products.length - 3} more items
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            {orderDate ? new Date(orderDate).toLocaleDateString('vi-VN') : '—'}
                        </Typography>
                        <Chip label={`${totalItems} items`} size="small" sx={{ ml: 1 }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {totalAmount.toLocaleString('vi-VN')}₫
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
