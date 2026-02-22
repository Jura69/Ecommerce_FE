import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ReactNode, ReactElement } from 'react';
import { tokens } from '../../theme/theme';

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
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: tokens.colors.stone900,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ mt: 0.5, color: tokens.colors.stone500 }}>
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
            color="secondary"
            startIcon={actionIcon}
            sx={{
              background: tokens.gradients.gold,
              color: '#FFFFFF',
              boxShadow: tokens.shadows.gold,
              '&:hover': { boxShadow: tokens.shadows.goldHover },
            }}
          >
            {actionLabel}
          </Button>
        ))}
    </Box>
  );
}
