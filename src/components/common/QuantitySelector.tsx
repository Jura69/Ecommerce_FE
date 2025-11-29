import { Box, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        onClick={onDecrease}
        disabled={disabled || quantity <= min}
        size="small"
      >
        <RemoveCircleOutlineIcon />
      </IconButton>
      <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
        {quantity}
      </Typography>
      <IconButton
        onClick={onIncrease}
        disabled={disabled || (max !== undefined && quantity >= max)}
        size="small"
      >
        <AddCircleOutlineIcon />
      </IconButton>
    </Box>
  );
}

