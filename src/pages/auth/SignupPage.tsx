import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowForward,
  StorefrontOutlined,
  CheckCircleOutline,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { tokens } from '../../theme/theme';

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<SignupFormValues>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<SignupFormValues>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof SignupFormValues]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    clearError();
  };

  const validate = (): boolean => {
    const errors: Partial<SignupFormValues> = {};
    if (!formData.name) errors.name = 'Name is required';
    else if (formData.name.length < 2) errors.name = 'Name must be at least 2 characters';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: 'inherit' as const };
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    if (strength <= 25) return { strength, label: 'Weak', color: 'error' as const };
    if (strength <= 50) return { strength, label: 'Fair', color: 'warning' as const };
    if (strength <= 75) return { strength, label: 'Good', color: 'info' as const };
    return { strength, label: 'Strong', color: 'success' as const };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${tokens.colors.stone100} 0%, ${tokens.colors.stone50} 50%, ${tokens.colors.gold50} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '50%',
          height: '70%',
          background: `radial-gradient(circle, rgba(202, 138, 4, 0.06) 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 4, md: 8 },
            alignItems: 'center',
          }}
        >
          {/* Left Side - Branding */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              gap: 4,
            }}
            className="fade-in-up"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  background: tokens.gradients.gold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: tokens.shadows.gold,
                }}
              >
                <StorefrontOutlined sx={{ fontSize: 28, color: '#FFFFFF' }} />
              </Box>
              <Typography
                variant="h4"
                sx={{ fontFamily: '"Rubik", sans-serif', fontWeight: 700, color: tokens.colors.stone900 }}
              >
                ShopSphere
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h2"
                sx={{ fontWeight: 700, color: tokens.colors.stone900, mb: 2, lineHeight: 1.15 }}
              >
                Start your{' '}
                <Box
                  component="span"
                  sx={{
                    background: tokens.gradients.gold,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  journey
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: tokens.colors.stone500, lineHeight: 1.6, mb: 4, fontWeight: 400 }}
              >
                Create your account and unlock exclusive access to curated collections and premium deals.
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                {[
                  'Exclusive Deals',
                  'Fast Shipping',
                  'Secure Checkout',
                  '24/7 Support',
                ].map((label, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${tokens.colors.stone200}`,
                      borderRadius: '12px',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: tokens.colors.gold300,
                        boxShadow: tokens.shadows.gold,
                      },
                    }}
                  >
                    <CheckCircleOutline sx={{ color: tokens.colors.gold600, fontSize: 22 }} />
                    <Typography variant="body2" sx={{ color: tokens.colors.stone700, fontWeight: 600 }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right Side - Signup Form */}
          <Box className="fade-in-up">
            <Box
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
              {/* Mobile Logo */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    background: tokens.gradients.gold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: tokens.shadows.gold,
                  }}
                >
                  <StorefrontOutlined sx={{ fontSize: 28, color: '#FFFFFF' }} />
                </Box>
              </Box>

              <Typography variant="h4" component="h1" textAlign="center" sx={{ fontWeight: 700, mb: 0.5, color: tokens.colors.stone900 }}>
                Create Account
              </Typography>
              <Typography variant="body2" textAlign="center" sx={{ mb: 4, color: tokens.colors.stone500 }}>
                Fill in your details to get started
              </Typography>

              {error && <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth label="Name" name="name" value={formData.name} onChange={handleChange}
                  error={!!formErrors.name} helperText={formErrors.name} margin="normal" autoComplete="name" autoFocus
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Person sx={{ color: tokens.colors.stone400 }} /></InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange}
                  error={!!formErrors.email} helperText={formErrors.email} margin="normal" autoComplete="email"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Email sx={{ color: tokens.colors.stone400 }} /></InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'}
                  value={formData.password} onChange={handleChange}
                  error={!!formErrors.password} helperText={formErrors.password} margin="normal" autoComplete="new-password"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: tokens.colors.stone400 }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: tokens.colors.stone400 }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {formData.password && (
                  <Box sx={{ mt: 1.5, mb: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: tokens.colors.stone500 }}>Password Strength</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }} color={passwordStrength.color}>{passwordStrength.label}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={passwordStrength.strength} color={passwordStrength.color} />
                  </Box>
                )}

                <TextField
                  fullWidth label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword} onChange={handleChange}
                  error={!!formErrors.confirmPassword} helperText={formErrors.confirmPassword} margin="normal" autoComplete="new-password"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: tokens.colors.stone400 }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small" sx={{ color: tokens.colors.stone400 }}>
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  fullWidth type="submit" variant="contained" color="secondary" size="large" disabled={isLoading}
                  endIcon={!isLoading && <ArrowForward />}
                  sx={{
                    mt: 3, mb: 2, py: 1.5, fontSize: '1rem',
                    background: tokens.gradients.gold, color: '#FFFFFF',
                    boxShadow: tokens.shadows.gold,
                    '&:hover': { boxShadow: tokens.shadows.goldHover },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" underline="hover"
                      sx={{ fontWeight: 600, color: tokens.colors.gold600, '&:hover': { color: tokens.colors.gold700 } }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
