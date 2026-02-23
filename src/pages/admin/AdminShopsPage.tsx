import { useEffect, useState } from 'react';
import {
    Container, Typography, Box, Paper, Table, TableHead, TableBody,
    TableRow, TableCell, TableContainer, Chip, Button, Pagination,
} from '@mui/material';
import { LoadingSpinner } from '../../components/common';
import { adminService, ShopListItem } from '../../services/api/adminService';
import { tokens } from '../../theme/theme';

export default function AdminShopsPage() {
    const [shops, setShops] = useState<ShopListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchShops = async (p = 1) => {
        try {
            setLoading(true);
            const res = await adminService.getShops({ page: p, limit: 20 });
            const data = (res as any)?.metadata;
            setShops(data?.shops || []);
            setTotal(data?.total || 0);
            setTotalPages(data?.totalPages || 1);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchShops(page); }, [page]);

    const handleStatusChange = async (shopId: string, newStatus: string) => {
        try {
            await adminService.updateShopStatus(shopId, newStatus);
            fetchShops(page);
        } catch { /* ignore */ }
    };

    if (loading && shops.length === 0) return <LoadingSpinner />;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Shop Management</Typography>
            <Typography variant="body2" sx={{ color: tokens.colors.stone500, mb: 3 }}>
                {total} shops registered
            </Typography>

            <TableContainer component={Paper} sx={{ border: `1px solid ${tokens.colors.stone200}` }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: tokens.colors.stone50 }}>
                            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Joined</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shops.map((shop) => (
                            <TableRow key={shop._id} hover>
                                <TableCell sx={{ fontWeight: 600 }}>{shop.name}</TableCell>
                                <TableCell>{shop.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={shop.status}
                                        size="small"
                                        color={shop.status === 'active' ? 'success' : shop.status === 'suspended' ? 'error' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>{new Date(shop.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {shop.status !== 'active' && (
                                        <Button size="small" color="success" onClick={() => handleStatusChange(shop._id, 'active')}>
                                            Activate
                                        </Button>
                                    )}
                                    {shop.status === 'active' && (
                                        <Button size="small" color="error" onClick={() => handleStatusChange(shop._id, 'suspended')}>
                                            Suspend
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
                    <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
                </Box>
            )}
        </Container>
    );
}
