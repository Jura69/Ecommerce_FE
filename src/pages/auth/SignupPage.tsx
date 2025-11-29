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

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const validate = (
    name: keyof SignupFormValues,
    value: any,
    allValues: SignupFormValues
  ): string | null => {
    switch (name) {
      case 'name':
        return validators.required(value) || validators.minLength(2)(value);
      case 'email':
        return validators.required(value) || validators.email(value);
      case 'password':
        return validators.required(value) || validators.minLength(6)(value);
      case 'confirmPassword':
        return (
          validators.required(value) ||
          validators.match('password', (field) => allValues[field as keyof SignupFormValues])(value)
        );
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
  } = useForm<SignupFormValues>(
    { name: '', email: '', password: '', confirmPassword: '' },
    validate
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
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
              Sign Up
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 4 }}
            >
              Create your account to get started.
            </Typography>

            <ErrorDisplay error={error} sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <FormField
                name="name"
                label="Shop Name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formErrors.name}
                touched={touched.name}
                margin="normal"
                autoComplete="name"
                autoFocus
              />

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
                autoComplete="new-password"
              />

              <FormField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formErrors.confirmPassword}
                touched={touched.confirmPassword}
                margin="normal"
                autoComplete="new-password"
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? <LoadingSpinner size={24} /> : 'Sign Up'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" underline="hover">
                    Login
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

