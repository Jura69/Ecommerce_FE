import { Card, CardContent, CardMedia, Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { QuantitySelector } from './';
import { formatters } from '../../utils';
import { CartProduct } from '../../types';

interface CartItemProps {
  item: CartProduct;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  imageSize?: number;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
  imageSize = 120,
}: CartItemProps) {
  return (
    <Card sx={{ display: 'flex', mb: 2 }}>
      <CardMedia
        component="img"
        sx={{
          width: imageSize,
          height: imageSize,
          objectFit: 'contain',
          p: 1,
        }}
        image={item.thumb}
        alt={item.name}
      />
      <CardContent
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography component="h5" variant="h6">
            {item.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {formatters.currency(item.price)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => onQuantityChange(item.productId, item.quantity + 1)}
            onDecrease={() => onQuantityChange(item.productId, item.quantity - 1)}
            min={1}
          />
          <IconButton color="error" onClick={() => onRemove(item.productId)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

