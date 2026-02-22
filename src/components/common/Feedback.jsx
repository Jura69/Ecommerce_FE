import PropTypes from 'prop-types';
import {
  Alert as MuiAlert,
  AlertTitle,
  Snackbar,
  CircularProgress,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import { Info, CheckCircle, Warning, Error as ErrorIcon } from '@mui/icons-material';

/**
 * Enhanced Alert component
 */
export function Alert({
  severity = 'info',
  title,
  message,
  onClose,
  action,
  sx = {},
  ...props
}) {
  return (
    <MuiAlert
      severity={severity}
      onClose={onClose}
      action={action}
      sx={{
        borderRadius: 2,
        ...sx,
      }}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </MuiAlert>
  );
}

Alert.propTypes = {
  severity: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  message: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  action: PropTypes.node,
  sx: PropTypes.object,
};

/**
 * Toast notification component
 */
export function Toast({
  open,
  onClose,
  message,
  severity = 'success',
  autoHideDuration = 5000,
  position = { vertical: 'bottom', horizontal: 'right' },
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <MuiAlert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ borderRadius: 2 }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
}

Toast.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  autoHideDuration: PropTypes.number,
  position: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'bottom']),
    horizontal: PropTypes.oneOf(['left', 'center', 'right']),
  }),
};

/**
 * Loading spinner component
 */
export function LoadingSpinner({ message, size = 40, sx = {} }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 2,
        ...sx,
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.number,
  sx: PropTypes.object,
};

/**
 * Empty state component
 */
export function EmptyState({
  icon,
  title = 'No data found',
  message,
  action,
  sx = {},
}) {
  const defaultIcons = {
    info: <Info sx={{ fontSize: 64, color: 'text.disabled' }} />,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        textAlign: 'center',
        py: 6,
        px: 3,
        ...sx,
      }}
    >
      <Box sx={{ mb: 2, opacity: 0.5 }}>
        {icon || defaultIcons.info}
      </Box>

      <Typography variant="h6" color="text.primary" gutterBottom>
        {title}
      </Typography>

      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 400 }}
        >
          {message}
        </Typography>
      )}

      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.node,
  sx: PropTypes.object,
};

/**
 * Skeleton loading placeholder
 */
export function SkeletonCard({ count = 1 }) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Box
          key={index}
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box
            sx={{
              height: 200,
              borderRadius: 1,
              bgcolor: 'action.hover',
              mb: 2,
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          />
          <Box
            sx={{
              height: 20,
              borderRadius: 1,
              bgcolor: 'action.hover',
              mb: 1,
              width: '80%',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <Box
            sx={{
              height: 16,
              borderRadius: 1,
              bgcolor: 'action.hover',
              width: '60%',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </Box>
      ))}
    </>
  );
}

SkeletonCard.propTypes = {
  count: PropTypes.number,
};
