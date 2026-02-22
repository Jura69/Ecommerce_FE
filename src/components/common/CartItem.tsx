import { Card, CardContent, CardMedia, Box, Typography, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { QuantitySelector } from './';
import { formatters } from '../../utils';
import { CartProduct } from '../../types';
import { tokens } from '../../theme/theme';

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
      <Box sx={{ bgcolor: tokens.colors.stone100, display: 'flex', alignItems: 'center', p: 1 }}>
        <CardMedia
          component="img"
          sx={{
            width: imageSize,
            height: imageSize,
            objectFit: 'contain',
            borderRadius: '8px',
          }}
          image={item.thumb}
          alt={item.name}
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
            variant="subtitle1"
            sx={{ fontWeight: 600, color: tokens.colors.stone900, lineHeight: 1.3 }}
          >
            {item.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 700, fontFamily: '"Rubik", sans-serif', color: tokens.colors.gold700, mt: 0.5 }}
          >
            {formatters.currency(item.price)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => onQuantityChange(item.productId, item.quantity + 1)}
            onDecrease={() => onQuantityChange(item.productId, item.quantity - 1)}
            min={1}
          />
          <IconButton
            onClick={() => onRemove(item.productId)}
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
