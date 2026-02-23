import { Card, CardContent, CardMedia, Box, Typography, IconButton, Chip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Link } from 'react-router-dom';
import { QuantitySelector } from './';
import { formatters } from '../../utils';
import { CartProduct } from '../../types';
import { tokens } from '../../theme/theme';

interface CartItemProps {
  item: CartProduct;
  onQuantityChange: (productId: string, quantity: number, skuId?: string) => void;
  onRemove: (productId: string, skuId?: string) => void;
  imageSize?: number;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
  imageSize = 100,
}: CartItemProps) {
  return (
    <Card
      sx={{
        display: 'flex',
        mb: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        component={Link}
        to={`/products/${item.productId}`}
        sx={{ bgcolor: tokens.colors.stone100, display: 'flex', alignItems: 'center', p: 1, textDecoration: 'none' }}
      >
        <CardMedia
          component="img"
          sx={{
            width: imageSize,
            height: imageSize,
            objectFit: 'contain',
            borderRadius: '8px',
          }}
          image={item.thumb || '/placeholder.png'}
          alt={item.name || 'Product'}
        />
      </Box>
      <CardContent
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          p: 2.5,
          '&:last-child': { pb: 2.5 },
        }}
      >
        <Box>
          <Typography
            component={Link}
            to={`/products/${item.productId}`}
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: tokens.colors.stone900,
              lineHeight: 1.3,
              textDecoration: 'none',
              '&:hover': { color: tokens.colors.gold700 },
            }}
          >
            {item.name || 'Unknown Product'}
          </Typography>
          {item.variationLabel && (
            <Chip
              label={item.variationLabel}
              size="small"
              sx={{
                mt: 0.5,
                bgcolor: tokens.colors.stone100,
                color: tokens.colors.stone600,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          )}
          <Typography
            variant="body1"
            sx={{ fontWeight: 700, fontFamily: '"Rubik", sans-serif', color: tokens.colors.gold700, mt: 0.5 }}
          >
            {formatters.currency(item.price || 0)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => onQuantityChange(item.productId, item.quantity + 1, item.skuId)}
            onDecrease={() => onQuantityChange(item.productId, item.quantity - 1, item.skuId)}
            min={1}
          />
          <IconButton
            onClick={() => onRemove(item.productId, item.skuId)}
            sx={{
              color: tokens.colors.stone400,
              '&:hover': { color: tokens.colors.error, bgcolor: tokens.colors.errorBg },
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
