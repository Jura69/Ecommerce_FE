import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { ReactElement } from 'react';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { tokens } from '../../theme/theme';

interface EmptyStateProps {
  icon?: ReactElement;
  title: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
}: EmptyStateProps) {
  return (
    <Paper
      sx={{
        p: { xs: 4, md: 6 },
        textAlign: 'center',
        border: `1px solid ${tokens.colors.stone200}`,
        borderRadius: '20px',
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {icon || (
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '16px',
              bgcolor: tokens.colors.stone100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <InboxOutlinedIcon sx={{ fontSize: 36, color: tokens.colors.stone400 }} />
          </Box>
        )}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: tokens.colors.stone700, mb: 1 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: tokens.colors.stone400, mb: 3, maxWidth: 360, mx: 'auto' }}>
          {description}
        </Typography>
      )}
      {actionLabel && (
        <Box>
          {actionPath ? (
            <Button
              component={Link}
              to={actionPath}
              variant="contained"
              color="secondary"
              sx={{
                background: tokens.gradients.gold,
                color: '#FFFFFF',
                boxShadow: tokens.shadows.gold,
              }}
            >
              {actionLabel}
            </Button>
          ) : (
            <Button onClick={onAction} variant="contained">
              {actionLabel}
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
}
