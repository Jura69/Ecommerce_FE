import PropTypes from 'prop-types';
import {
  Button as MuiButton,
  IconButton as MuiIconButton,
  CircularProgress,
} from '@mui/material';

/**
 * Modern Button component with multiple variants
 * Supports loading state, icons, and consistent styling
 */
export default function Button({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  children,
  sx = {},
  ...props
}) {
  // Variant mapping
  const variantMap = {
    primary: { variant: 'contained', color: 'primary' },
    secondary: { variant: 'contained', color: 'secondary' },
    outlined: { variant: 'outlined', color: 'primary' },
    text: { variant: 'text', color: 'primary' },
    error: { variant: 'contained', color: 'error' },
    success: { variant: 'contained', color: 'success' },
  };

  const { variant: muiVariant, color } = variantMap[variant] || variantMap.primary;

  // Size mapping for better spacing
  const sizeStyles = {
    small: { px: 2, py: 0.75, fontSize: '0.875rem' },
    medium: { px: 3, py: 1, fontSize: '0.9375rem' },
    large: { px: 4, py: 1.25, fontSize: '1rem' },
  };

  return (
    <MuiButton
      variant={muiVariant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? undefined : startIcon}
      endIcon={loading ? undefined : endIcon}
      onClick={onClick}
      type={type}
      sx={{
        ...sizeStyles[size],
        textTransform: 'none',
        fontWeight: 500,
        boxShadow: muiVariant === 'contained' ? 1 : 0,
        '&:hover': {
          boxShadow: muiVariant === 'contained' ? 2 : 0,
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
            color="inherit"
            sx={{ mr: 1 }}
          />
          {children}
        </>
      ) : (
        children
      )}
    </MuiButton>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outlined', 'text', 'error', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};

/**
 * Icon Button component for compact icon-only actions
 */
export function IconButton({
  icon,
  color = 'default',
  size = 'medium',
  onClick,
  disabled = false,
  tooltip,
  sx = {},
  ...props
}) {
  return (
    <MuiIconButton
      color={color}
      size={size}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      sx={{
        '&:hover': {
          bgcolor: 'action.hover',
        },
        ...sx,
      }}
      {...props}
    >
      {icon}
    </MuiIconButton>
  );
}

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
  sx: PropTypes.object,
};
