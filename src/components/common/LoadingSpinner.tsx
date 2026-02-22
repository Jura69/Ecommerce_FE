import { Box, Typography } from '@mui/material';
import { tokens } from '../../theme/theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export default function LoadingSpinner({
  message = 'Loading...',
  size = 40,
}: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `3px solid ${tokens.colors.stone200}`,
          borderTopColor: tokens.colors.gold500,
          animation: 'spin 0.8s linear infinite',
          '@keyframes spin': {
            to: { transform: 'rotate(360deg)' },
          },
        }}
      />
      {message && (
        <Typography variant="body2" sx={{ color: tokens.colors.stone400, fontWeight: 500 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
