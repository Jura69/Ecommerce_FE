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
    Avatar,
    Divider,
    Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import { profileService, ProfileData } from '../../services/api/profileService';

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await profileService.getProfile();
            const data = response?.metadata;
            if (data) {
                setProfile(data);
                setName(data.name || '');
                setPhone(data.phone || '');
                setDescription(data.description || '');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            const response = await profileService.updateProfile({ name, phone, description });
            setProfile(response?.metadata || null);
            setSuccess('Profile updated successfully');
        } catch (err: any) {
            setError(err?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: { xs: 2, md: 4 } }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
                Profile Settings
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            <Paper sx={{ p: 3 }}>
                {/* Avatar & identity */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                        {profile?.avatar ? (
                            <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <PersonIcon sx={{ fontSize: 32 }} />
                        )}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {profile?.name || 'User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {profile?.email}
                        </Typography>
                        <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
                            <Chip
                                label={profile?.status || 'inactive'}
                                size="small"
                                color={profile?.status === 'active' ? 'success' : 'default'}
                            />
                            {profile?.verify && <Chip label="Verified" size="small" color="info" />}
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Editable fields */}
                <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                    slotProps={{ htmlInput: { maxLength: 150 } }}
                />
                <TextField
                    fullWidth
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    sx={{ mb: 2 }}
                    slotProps={{ htmlInput: { maxLength: 20 } }}
                    placeholder="e.g. 0912345678"
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                    sx={{ mb: 3 }}
                    slotProps={{ htmlInput: { maxLength: 500 } }}
                    placeholder="Tell us about yourself or your shop..."
                />

                <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    fullWidth
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Paper>
        </Container>
    );
}
