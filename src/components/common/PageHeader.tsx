import { Box, Typography, Button, SxProps, Theme } from '@mui/material';
import { Link } from 'react-router-dom';
import { ReactNode, ReactElement } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionPath?: string;
  onAction?: () => void;
  actionIcon?: ReactElement;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  actionPath,
  onAction,
  actionIcon,
  children,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {children ||
        (actionLabel && (
          <Button
            component={actionPath ? (Link as any) : 'button'}
            to={actionPath}
            onClick={onAction}
            variant="contained"
            color="primary"
            startIcon={actionIcon}
          >
            {actionLabel}
          </Button>
        ))}
    </Box>
  );
}

