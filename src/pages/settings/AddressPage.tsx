import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { addressService, AddressData, CreateAddressData } from '../../services/api/addressService';

const EMPTY_FORM: CreateAddressData = {
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Vietnam',
    isDefault: false,
    label: 'home',
};

export default function AddressPage() {
    const [addresses, setAddresses] = useState<AddressData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateAddressData>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const response = await addressService.getAddresses();
            setAddresses(response?.metadata || []);
        } catch (err: any) {
            setError(err?.message || 'Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const openCreateDialog = () => {
        setEditingId(null);
        setFormData(EMPTY_FORM);
        setDialogOpen(true);
    };

    const openEditDialog = (addr: AddressData) => {
        setEditingId(addr._id);
        setFormData({
            fullName: addr.address_fullName,
            phone: addr.address_phone,
            street: addr.address_street,
            city: addr.address_city,
            state: addr.address_state || '',
            zipCode: addr.address_zipCode,
            country: addr.address_country,
            isDefault: addr.address_isDefault,
            label: addr.address_label || 'home',
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            if (editingId) {
                await addressService.updateAddress(editingId, formData);
            } else {
                await addressService.createAddress(formData);
            }
            setDialogOpen(false);
            await loadAddresses();
        } catch (err: any) {
            setError(err?.message || 'Failed to save address');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (addressId: string) => {
        try {
            setError(null);
            await addressService.deleteAddress(addressId);
            await loadAddresses();
        } catch (err: any) {
            setError(err?.message || 'Failed to delete address');
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            setError(null);
            await addressService.setDefault(addressId);
            await loadAddresses();
        } catch (err: any) {
            setError(err?.message || 'Failed to set default');
        }
    };

    const updateField = (field: keyof CreateAddressData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                    My Addresses
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
                    Add Address
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {addresses.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <LocationOnIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                        No addresses yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add a shipping address to speed up checkout
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
                        Add Your First Address
                    </Button>
                </Paper>
            )}

            {addresses.map((addr) => (
                <Paper key={addr._id} sx={{ p: 2.5, mb: 2, border: addr.address_isDefault ? '2px solid' : '1px solid', borderColor: addr.address_isDefault ? 'primary.main' : 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {addr.address_fullName}
                                </Typography>
                                <Chip label={addr.address_label || 'home'} size="small" variant="outlined" />
                                {addr.address_isDefault && (
                                    <Chip label="Default" size="small" color="primary" icon={<StarIcon />} />
                                )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">{addr.address_phone}</Typography>
                            <Typography variant="body2">
                                {addr.address_street}, {addr.address_city}
                                {addr.address_state ? `, ${addr.address_state}` : ''}, {addr.address_zipCode}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">{addr.address_country}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {!addr.address_isDefault && (
                                <IconButton size="small" onClick={() => handleSetDefault(addr._id)} title="Set as default">
                                    <StarBorderIcon fontSize="small" />
                                </IconButton>
                            )}
                            <IconButton size="small" onClick={() => openEditDialog(addr)} title="Edit">
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete(addr._id)} title="Delete">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>
            ))}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingId ? 'Edit Address' : 'New Address'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={formData.fullName}
                            onChange={(e) => updateField('fullName', e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Phone"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Street Address"
                            value={formData.street}
                            onChange={(e) => updateField('street', e.target.value)}
                            required
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="City"
                                value={formData.city}
                                onChange={(e) => updateField('city', e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="State/Province"
                                value={formData.state}
                                onChange={(e) => updateField('state', e.target.value)}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Zip Code"
                                value={formData.zipCode}
                                onChange={(e) => updateField('zipCode', e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Country"
                                value={formData.country}
                                onChange={(e) => updateField('country', e.target.value)}
                            />
                        </Box>
                        <FormControl fullWidth>
                            <InputLabel>Label</InputLabel>
                            <Select
                                value={formData.label}
                                label="Label"
                                onChange={(e) => updateField('label', e.target.value)}
                            >
                                <MenuItem value="home">🏠 Home</MenuItem>
                                <MenuItem value="office">🏢 Office</MenuItem>
                                <MenuItem value="other">📍 Other</MenuItem>
                            </Select>
                        </FormControl>
                        {!editingId && (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isDefault}
                                        onChange={(e) => updateField('isDefault', e.target.checked)}
                                    />
                                }
                                label="Set as default address"
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDialogOpen(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving || !formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.zipCode}
                        startIcon={saving ? <CircularProgress size={16} /> : null}
                    >
                        {saving ? 'Saving...' : editingId ? 'Update' : 'Add Address'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
