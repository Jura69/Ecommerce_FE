import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Link,
} from '@mui/material';
import { useAuthStore } from '../../store';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils';
import { FormField, ErrorDisplay, LoadingSpinner } from '../../components/common';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const validate = (name: keyof LoginFormValues, value: any): string | null => {
    switch (name) {
      case 'email':
        return validators.required(value) || validators.email(value);
      case 'password':
        return validators.required(value) || validators.minLength(6)(value);
      default:
        return null;
    }
  };

  const {
    values: formData,
    errors: formErrors,
    touched,
    handleChange,
    handleBlur,
    validate: validateForm,
  } = useForm<LoginFormValues>({ email: '', password: '' }, validate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
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
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              Login
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 4 }}
            >
              Welcome back! Please login to your account.
            </Typography>

            <ErrorDisplay error={error} sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <FormField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formErrors.email}
                touched={touched.email}
                margin="normal"
                autoComplete="email"
                autoFocus
              />

              <FormField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formErrors.password}
                touched={touched.password}
                margin="normal"
                autoComplete="current-password"
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? <LoadingSpinner size={24} /> : 'Login'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/signup" underline="hover">
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

