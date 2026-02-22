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
import { tokens } from '../../theme/theme';

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
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: tokens.shadows.cardHover,
          '& .product-image': {
            transform: 'scale(1.03)',
          },
        },
      }}
    >
      <Box sx={{ overflow: 'hidden', bgcolor: tokens.colors.stone100, position: 'relative' }}>
        <CardMedia
          component="img"
          height={imageHeight}
          image={product.product_thumb}
          alt={product.product_name}
          className="product-image"
          sx={{
            objectFit: 'contain',
            p: 2,
            transition: 'transform 0.3s ease',
          }}
        />
        {isOutOfStock && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: tokens.colors.error,
              color: '#fff',
              px: 1.5,
              py: 0.5,
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            Out of Stock
          </Box>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: tokens.colors.stone900,
            lineHeight: 1.4,
          }}
        >
          {product.product_name}
        </Typography>
        {showDescription && product.product_description && (
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: tokens.colors.stone500,
              lineHeight: 1.5,
            }}
          >
            {product.product_description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontFamily: '"Rubik", sans-serif',
              color: tokens.colors.gold700,
            }}
          >
            ${product.product_price}
          </Typography>
          {product.product_type && (
            <Chip
              label={product.product_type}
              size="small"
              sx={{
                bgcolor: tokens.colors.stone100,
                color: tokens.colors.stone600,
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
        {showStock && !isOutOfStock && (
          <Typography variant="body2" sx={{ color: tokens.colors.stone400, fontSize: '0.8rem' }}>
            {product.product_quantity} in stock
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          component={Link}
          to={`/products/${product._id}`}
          size="small"
          variant="outlined"
          fullWidth
          sx={{ borderRadius: '8px' }}
        >
          View Details
        </Button>
        {onAddToCart && (
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<AddShoppingCartIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={isOutOfStock}
            sx={{
              background: tokens.gradients.gold,
              color: '#FFFFFF',
              borderRadius: '8px',
              minWidth: 'auto',
              whiteSpace: 'nowrap',
              '&:hover': {
                boxShadow: tokens.shadows.gold,
              },
            }}
          >
            Add
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
