import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { tokens } from '../../theme/theme';

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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: `1.5px solid ${tokens.colors.stone200}`,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <IconButton
        onClick={onDecrease}
        disabled={disabled || quantity <= min}
        size="small"
        sx={{
          borderRadius: 0,
          color: tokens.colors.stone600,
          '&:hover': { bgcolor: tokens.colors.stone100 },
        }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Typography
        sx={{
          minWidth: 36,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '0.9rem',
          fontFamily: '"Rubik", sans-serif',
          color: tokens.colors.stone900,
          borderLeft: `1px solid ${tokens.colors.stone200}`,
          borderRight: `1px solid ${tokens.colors.stone200}`,
          py: 0.5,
        }}
      >
        {quantity}
      </Typography>
      <IconButton
        onClick={onIncrease}
        disabled={disabled || (max !== undefined && quantity >= max)}
        size="small"
        sx={{
          borderRadius: 0,
          color: tokens.colors.stone600,
          '&:hover': { bgcolor: tokens.colors.stone100 },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
