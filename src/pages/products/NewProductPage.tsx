import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment,
  Divider,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Image,
  Description,
  AttachMoney,
  Inventory,
  Category,
} from '@mui/icons-material';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { productService } from '../../services/api';
import { tokens } from '../../theme/theme';

const productTypes = [
  { value: 'Electronics', label: 'Electronics', icon: '📱' },
  { value: 'Clothing', label: 'Clothing', icon: '👕' },
  { value: 'Furniture', label: 'Furniture', icon: '🪑' },
  { value: 'Books', label: 'Books', icon: '📚' },
];

interface ProductFormData {
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_price: string;
  product_quantity: string;
  product_type: string;
  product_attributes: Record<string, any>;
}

export default function NewProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData & FieldValues>({
    defaultValues: {
      product_name: '',
      product_thumb: '',
      product_description: '',
      product_price: '',
      product_quantity: '',
      product_type: 'Electronics',
      product_attributes: {},
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      setError(null);
      const formattedData = {
        ...data,
        product_price: Number(data.product_price),
        product_quantity: Number(data.product_quantity),
        product_attributes:
          data.product_type === 'Electronics'
            ? { manufacturer: 'Default Manufacturer', model: 'Default Model', color: 'Default Color' }
            : { brand: 'Default Brand', size: 'M', material: 'Default Material' },
      };
      await productService.createProduct(formattedData);
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/products')}
        sx={{ mb: 3, color: tokens.colors.stone500 }}
      >
        Back to Products
      </Button>

      <Paper sx={{ p: { xs: 3, sm: 5 }, border: `1px solid ${tokens.colors.stone200}`, borderRadius: '20px' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: tokens.colors.stone900 }}>
          Create New Product
        </Typography>
        <Typography variant="body2" sx={{ color: tokens.colors.stone500, mb: 4 }}>
          Fill in the details below to add a new product to your store
        </Typography>

        {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Controller name="product_name" control={control} rules={{ required: 'Product name is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Product Name" fullWidth error={!!errors.product_name} helperText={errors.product_name?.message as string}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Description sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller name="product_thumb" control={control} rules={{ required: 'Product thumbnail URL is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Product Thumbnail URL" fullWidth error={!!errors.product_thumb} helperText={errors.product_thumb?.message as string}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Image sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller name="product_description" control={control}
                render={({ field }) => (
                  <TextField {...field} label="Product Description" fullWidth multiline rows={4} value={field.value || ''}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="product_price" control={control}
                rules={{ required: 'Price is required', pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Invalid price format' } }}
                render={({ field }) => (
                  <TextField {...field} label="Price" type="number" fullWidth error={!!errors.product_price} helperText={errors.product_price?.message as string}
                    InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="product_quantity" control={control}
                rules={{ required: 'Quantity is required', pattern: { value: /^\d+$/, message: 'Invalid quantity' } }}
                render={({ field }) => (
                  <TextField {...field} label="Quantity" type="number" fullWidth error={!!errors.product_quantity} helperText={errors.product_quantity?.message as string}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Inventory sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller name="product_type" control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Product Type" fullWidth
                    InputProps={{ startAdornment: <InputAdornment position="start"><Category sx={{ color: tokens.colors.stone400 }} /></InputAdornment> }}
                  >
                    {productTypes.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography component="span" sx={{ fontSize: '1.2rem' }}>{opt.icon}</Typography>
                          <Typography>{opt.label}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/products')} sx={{ px: 4 }}>Cancel</Button>
            <Button
              type="submit" variant="contained" color="secondary" disabled={loading} startIcon={!loading && <Save />}
              sx={{
                px: 4, background: tokens.gradients.gold, color: '#FFFFFF',
                boxShadow: tokens.shadows.gold,
                '&:hover': { boxShadow: tokens.shadows.goldHover },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Product'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
