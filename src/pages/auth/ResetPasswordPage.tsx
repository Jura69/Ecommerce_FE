import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    InputAdornment,
} from '@mui/material';
import { Lock, ArrowBack } from '@mui/icons-material';
import axiosInstance from '../../services/api/axios';
import { tokens } from '../../theme/theme';

export default function ResetPasswordPage() {
    const { token } = useParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
        if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
        try {
            setLoading(true);
            setError(null);
            await axiosInstance.post('/password/reset', { token, newPassword });
            setSuccess(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${tokens.colors.stone100} 0%, ${tokens.colors.stone50} 50%, ${tokens.colors.gold50} 100%)`,
            }}
        >
            <Container maxWidth="sm">
                <Box
                    className="fade-in-up"
                    sx={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        border: `1px solid ${tokens.colors.stone200}`,
                        p: { xs: 3, sm: 5 },
                        boxShadow: tokens.shadows.lg,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '40%',
                            height: '3px',
                            background: tokens.gradients.gold,
                            borderRadius: '0 0 4px 4px',
                        },
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: tokens.colors.stone900 }}>
                        Reset Password
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', color: tokens.colors.stone500 }}>
                        Enter your new password below
                    </Typography>

                    {success ? (
                        <>
                            <Alert severity="success" sx={{ mb: 3 }}>Password reset successfully!</Alert>
                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        background: tokens.gradients.gold,
                                        color: '#FFFFFF',
                                        boxShadow: tokens.shadows.gold,
                                    }}
                                >
                                    Go to Login
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Box component="form" onSubmit={handleSubmit}>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <TextField
                                label="New Password" type="password" value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth required sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: tokens.colors.stone400 }} /></InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Confirm Password" type="password" value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth required sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: tokens.colors.stone400 }} /></InputAdornment>,
                                }}
                            />
                            <Button
                                type="submit" variant="contained" color="secondary" fullWidth size="large" disabled={loading}
                                sx={{
                                    py: 1.5, background: tokens.gradients.gold, color: '#FFFFFF',
                                    boxShadow: tokens.shadows.gold,
                                    '&:hover': { boxShadow: tokens.shadows.goldHover },
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button
                            component={Link} to="/login" startIcon={<ArrowBack />}
                            sx={{ color: tokens.colors.stone500, '&:hover': { color: tokens.colors.stone900 } }}
                        >
                            Back to Login
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
