import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Chip,
    Divider,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { shopDashboardService, ShopStats } from '../../services/api/shopDashboardService';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                            {value}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: `${color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState<ShopStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await shopDashboardService.getStats();
                setStats(response?.metadata || null);
            } catch (err: any) {
                setError(err?.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Shop Dashboard
            </Typography>

            {/* Stats cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <StatCard
                        title="Total Products"
                        value={stats?.productCount || 0}
                        icon={<InventoryIcon />}
                        color="#2196f3"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <StatCard
                        title="Total Orders"
                        value={stats?.orderCount || 0}
                        icon={<ShoppingCartIcon />}
                        color="#4caf50"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <StatCard
                        title="Total Revenue"
                        value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
                        icon={<AttachMoneyIcon />}
                        color="#ff9800"
                    />
                </Grid>
            </Grid>

            {/* Quick links */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Quick Actions
                </Typography>
                <List>
                    <ListItem component="a" href="/dashboard/products" sx={{ cursor: 'pointer' }}>
                        <ListItemText
                            primary="Manage Products"
                            secondary="View and manage your product listings"
                        />
                        <Chip label={`${stats?.productCount || 0} products`} size="small" />
                    </ListItem>
                    <Divider />
                    <ListItem component="a" href="/dashboard/orders" sx={{ cursor: 'pointer' }}>
                        <ListItemText
                            primary="Manage Orders"
                            secondary="View and process incoming orders"
                        />
                        <Chip label={`${stats?.orderCount || 0} orders`} size="small" />
                    </ListItem>
                </List>
            </Paper>
        </Container>
    );
}
