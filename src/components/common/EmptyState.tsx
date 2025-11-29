import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { ReactElement } from 'react';

interface EmptyStateProps {
  icon?: ReactElement;
  title: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
}: EmptyStateProps) {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      {Icon && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          {Icon}
        </Box>
      )}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          {description}
        </Typography>
      )}
      {actionLabel && (
        <Box>
          {actionPath ? (
            <Button component={Link} to={actionPath} variant="contained">
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

