import { Box, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { OrderStatusHistoryEntry } from '../../types';

const STATUS_CONFIG: Record<
    string,
    { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; icon: React.ReactNode }
> = {
    pending: { label: 'Pending', color: 'warning', icon: <HourglassEmptyIcon fontSize="small" /> },
    confirmed: { label: 'Confirmed', color: 'info', icon: <InventoryIcon fontSize="small" /> },
    shipped: { label: 'Shipped', color: 'primary', icon: <LocalShippingIcon fontSize="small" /> },
    delivered: { label: 'Delivered', color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
    cancelled: { label: 'Cancelled', color: 'error', icon: <CancelIcon fontSize="small" /> },
};

const STATUS_ORDER = ['pending', 'confirmed', 'shipped', 'delivered'];

interface OrderStatusTimelineProps {
    currentStatus: string;
    statusHistory?: OrderStatusHistoryEntry[];
    compact?: boolean;
}

export default function OrderStatusTimeline({
    currentStatus,
    statusHistory = [],
    compact = false,
}: OrderStatusTimelineProps) {
    const isCancelled = currentStatus === 'cancelled';
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);

    if (compact) {
        const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
        return (
            <Chip
                icon={<>{config.icon}</>}
                label={config.label}
                color={config.color}
                size="small"
                variant="outlined"
            />
        );
    }

    return (
        <Box>
            {/* Progress steps */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {STATUS_ORDER.map((status, index) => {
                    const config = STATUS_CONFIG[status];
                    const isCompleted = !isCancelled && index <= currentIndex;
                    const isActive = status === currentStatus;

                    return (
                        <Box key={status} sx={{ display: 'flex', alignItems: 'center', flex: index < STATUS_ORDER.length - 1 ? 1 : 'none' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: isCompleted ? `${config.color}.main` : 'grey.200',
                                        color: isCompleted ? 'white' : 'grey.500',
                                        border: isActive ? '3px solid' : 'none',
                                        borderColor: isActive ? `${config.color}.light` : 'transparent',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {config.icon}
                                </Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 0.5,
                                        fontWeight: isActive ? 700 : 400,
                                        color: isCompleted ? 'text.primary' : 'text.disabled',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    {config.label}
                                </Typography>
                            </Box>
                            {index < STATUS_ORDER.length - 1 && (
                                <Box
                                    sx={{
                                        flex: 1,
                                        height: 3,
                                        mx: 1,
                                        mb: 2.5,
                                        bgcolor: !isCancelled && index < currentIndex ? 'primary.main' : 'grey.200',
                                        borderRadius: 1,
                                        transition: 'all 0.3s ease',
                                    }}
                                />
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* Cancelled badge */}
            {isCancelled && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Chip
                        icon={<CancelIcon />}
                        label="Order Cancelled"
                        color="error"
                        variant="filled"
                    />
                </Box>
            )}

            {/* Status history */}
            {statusHistory.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Status History
                    </Typography>
                    {statusHistory.map((entry, index) => {
                        const config = STATUS_CONFIG[entry.status] || STATUS_CONFIG.pending;
                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.5,
                                    py: 0.8,
                                    borderLeft: '2px solid',
                                    borderColor: 'grey.300',
                                    pl: 2,
                                    ml: 1,
                                    '&:last-child': { borderColor: 'transparent' },
                                }}
                            >
                                <Chip label={config.label} color={config.color} size="small" sx={{ minWidth: 80 }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(entry.changedAt).toLocaleString('vi-VN')}
                                    </Typography>
                                    {entry.reason && (
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            Reason: {entry.reason}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}
