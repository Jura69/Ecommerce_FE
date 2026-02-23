import { useEffect, useState } from 'react';
import {
    Container, Typography, Box, Grid, Paper,
} from '@mui/material';
import {
    StorefrontOutlined, InventoryOutlined, ShoppingCartOutlined, AttachMoneyOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common';
import { adminService, SystemStats } from '../../services/api/adminService';
import { tokens } from '../../theme/theme';

const STAT_CARDS = [
    { key: 'totalShops', label: 'Total Shops', icon: <StorefrontOutlined />, color: tokens.colors.info },
    { key: 'totalProducts', label: 'Total Products', icon: <InventoryOutlined />, color: tokens.colors.success },
    { key: 'totalOrders', label: 'Total Orders', icon: <ShoppingCartOutlined />, color: tokens.colors.warning },
    { key: 'totalRevenue', label: 'Total Revenue', icon: <AttachMoneyOutlined />, color: tokens.colors.gold600, prefix: '$' },
];

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await adminService.getSystemStats();
                setStats((res as any)?.metadata || null);
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        fetch();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Admin Dashboard</Typography>
            <Typography variant="body2" sx={{ color: tokens.colors.stone500, mb: 4 }}>
                System-wide overview and management
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {STAT_CARDS.map((card) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.key}>
                        <Paper
                            sx={{
                                p: 3, border: `1px solid ${tokens.colors.stone200}`,
                                display: 'flex', alignItems: 'center', gap: 2,
                            }}
                        >
                            <Box sx={{
                                width: 52, height: 52, borderRadius: '14px',
                                bgcolor: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                '& svg': { color: card.color, fontSize: 28 },
                            }}>
                                {card.icon}
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>{card.label}</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    {card.prefix || ''}{stats ? (stats as any)[card.key]?.toLocaleString() : '—'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                        component={Link} to="/admin/shops"
                        sx={{
                            p: 4, textAlign: 'center', textDecoration: 'none', color: 'inherit',
                            border: `1px solid ${tokens.colors.stone200}`,
                            transition: 'all 0.2s', '&:hover': { borderColor: tokens.colors.gold300, boxShadow: tokens.shadows.gold },
                        }}
                    >
                        <StorefrontOutlined sx={{ fontSize: 48, color: tokens.colors.gold600, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Manage Shops</Typography>
                        <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>
                            Approve, suspend, and review shops
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                        component={Link} to="/admin/orders"
                        sx={{
                            p: 4, textAlign: 'center', textDecoration: 'none', color: 'inherit',
                            border: `1px solid ${tokens.colors.stone200}`,
                            transition: 'all 0.2s', '&:hover': { borderColor: tokens.colors.gold300, boxShadow: tokens.shadows.gold },
                        }}
                    >
                        <ShoppingCartOutlined sx={{ fontSize: 48, color: tokens.colors.gold600, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Manage Orders</Typography>
                        <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>
                            View and manage all system orders
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
