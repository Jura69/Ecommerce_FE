import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';

/**
 * Clean modal component for custom content
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  dividers = true,
  sx = {},
  ...props
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          ...sx,
        },
      }}
      {...props}
    >
      {/* Title with close button */}
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
          }}
        >
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {onClose && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {/* Content */}
      <DialogContent dividers={dividers} sx={{ py: 3 }}>
        {children}
      </DialogContent>

      {/* Actions */}
      {actions && (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  dividers: PropTypes.bool,
  sx: PropTypes.object,
};

/**
 * Confirmation dialog with consistent styling
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  loading = false,
}) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="text" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          loading={loading}
          color={confirmColor}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmColor: PropTypes.string,
  loading: PropTypes.bool,
};

// Import Button component (assuming it exists)
import Button from './Button';
