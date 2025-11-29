import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { productService } from '../../services/api';

const productTypes = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Books', label: 'Books' },
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

function NewProductPage() {
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
            ? {
                manufacturer: 'Default Manufacturer',
                model: 'Default Model',
                color: 'Default Color',
              }
            : {
                brand: 'Default Brand',
                size: 'M',
                material: 'Default Material',
              },
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Product
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="product_name"
                control={control}
                rules={{ required: 'Product name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Product Name"
                    fullWidth
                    error={!!errors.product_name}
                    helperText={errors.product_name?.message as string}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="product_thumb"
                control={control}
                rules={{ required: 'Product thumbnail URL is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Product Thumbnail URL"
                    fullWidth
                    error={!!errors.product_thumb}
                    helperText={errors.product_thumb?.message as string}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="product_description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Product Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="product_price"
                control={control}
                rules={{
                  required: 'Price is required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Invalid price format',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Price"
                    type="number"
                    fullWidth
                    error={!!errors.product_price}
                    helperText={errors.product_price?.message as string}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="product_quantity"
                control={control}
                rules={{
                  required: 'Quantity is required',
                  pattern: {
                    value: /^\d+$/,
                    message: 'Invalid quantity',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quantity"
                    type="number"
                    fullWidth
                    error={!!errors.product_quantity}
                    helperText={errors.product_quantity?.message as string}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="product_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Product Type"
                    fullWidth
                  >
                    {productTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Product'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default NewProductPage;

