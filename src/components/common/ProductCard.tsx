import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showDescription?: boolean;
  showStock?: boolean;
  imageHeight?: number;
}

export default function ProductCard({
  product,
  onAddToCart,
  showDescription = true,
  showStock = true,
  imageHeight = 200,
}: ProductCardProps) {
  const isOutOfStock = product.product_quantity === 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        height={imageHeight}
        image={product.product_thumb}
        alt={product.product_name}
        sx={{ objectFit: 'contain', p: 2, bgcolor: 'grey.50' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.product_name}
        </Typography>
        {showDescription && product.product_description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.product_description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
            ${product.product_price}
          </Typography>
          {product.product_type && (
            <Chip
              label={product.product_type}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
        </Box>
        {showStock && (
          <Typography
            variant="body2"
            color={isOutOfStock ? 'error.main' : 'text.secondary'}
          >
            Stock: {product.product_quantity}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          to={`/products/${product._id}`}
          size="small"
          variant="outlined"
          fullWidth
          sx={{ mr: 1 }}
        >
          View Details
        </Button>
        {onAddToCart && (
          <Button
            size="small"
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
          >
            Add
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

