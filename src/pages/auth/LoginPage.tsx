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
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowForward,
  StorefrontOutlined,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { tokens } from '../../theme/theme';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginFormValues>({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<LoginFormValues>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name as keyof LoginFormValues]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    clearError();
  };

  const validate = (): boolean => {
    const errors: Partial<LoginFormValues> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${tokens.colors.stone100} 0%, ${tokens.colors.stone50} 50%, ${tokens.colors.gold50} 100%)`,
        position: 'relative',
        overflow: 'hidden',

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
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '50%',
          height: '70%',
          background: `radial-gradient(circle, rgba(28, 25, 23, 0.03) 0%, transparent 70%)`,
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
            minHeight: '80vh',
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
            {/* Logo */}
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
                sx={{
                  fontFamily: '"Rubik", sans-serif',
                  fontWeight: 700,
                  color: tokens.colors.stone900,
                }}
              >
                ShopSphere
              </Typography>
            </Box>

            {/* Hero Text */}
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: tokens.colors.stone900,
                  mb: 2,
                  lineHeight: 1.15,
                }}
              >
                Welcome{' '}
                <Box
                  component="span"
                  sx={{
                    background: tokens.gradients.gold,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  back
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: tokens.colors.stone500,
                  lineHeight: 1.6,
                  mb: 4,
                  fontWeight: 400,
                }}
              >
                Sign in to access your personalized shopping experience with exclusive deals and curated collections.
              </Typography>

              {/* Stats */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {[
                  { value: '10K+', label: 'Products' },
                  { value: '5K+', label: 'Customers' },
                  { value: '99%', label: 'Satisfaction' },
                ].map((stat, index) => (
                  <Box
                    key={index}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${tokens.colors.stone200}`,
                      borderRadius: '12px',
                      p: 2.5,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'default',
                      '&:hover': {
                        borderColor: tokens.colors.gold300,
                        boxShadow: tokens.shadows.gold,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        background: tokens.gradients.gold,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: tokens.colors.stone500, fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right Side - Login Form */}
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
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
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

              <Typography
                variant="h4"
                component="h1"
                textAlign="center"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  color: tokens.colors.stone900,
                }}
              >
                Sign In
              </Typography>

              <Typography
                variant="body2"
                textAlign="center"
                sx={{ mb: 4, color: tokens.colors.stone500 }}
              >
                Enter your credentials to access your account
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  onClose={clearError}
                  sx={{ mb: 3 }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  margin="normal"
                  autoComplete="email"
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: tokens.colors.stone400 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  margin="normal"
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: tokens.colors.stone400 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: tokens.colors.stone400 }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    underline="hover"
                    sx={{
                      fontSize: '0.8125rem',
                      color: tokens.colors.gold600,
                      fontWeight: 600,
                      '&:hover': { color: tokens.colors.gold700 },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={isLoading}
                  endIcon={!isLoading && <ArrowForward />}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    background: tokens.gradients.gold,
                    color: '#FFFFFF',
                    boxShadow: tokens.shadows.gold,
                    '&:hover': {
                      boxShadow: tokens.shadows.goldHover,
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" sx={{ color: tokens.colors.stone500 }}>
                    Don't have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/signup"
                      underline="hover"
                      sx={{
                        fontWeight: 600,
                        color: tokens.colors.gold600,
                        '&:hover': { color: tokens.colors.gold700 },
                      }}
                    >
                      Create Account
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
