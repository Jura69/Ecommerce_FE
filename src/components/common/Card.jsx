import PropTypes from 'prop-types';
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardActions as MuiCardActions,
  Typography,
  Box,
  Divider,
} from '@mui/material';

/**
 * Clean Card component with consistent styling
 */
export default function Card({
  children,
  elevation = 1,
  hover = false,
  padding = 3,
  sx = {},
  ...props
}) {
  return (
    <MuiCard
      elevation={elevation}
      sx={{
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        ...(hover && {
          '&:hover': {
            elevation: 3,
            transform: 'translateY(-2px)',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ p: padding }}>{children}</Box>
    </MuiCard>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  elevation: PropTypes.oneOf([0, 1, 2, 3]),
  hover: PropTypes.bool,
  padding: PropTypes.number,
  sx: PropTypes.object,
};

/**
 * Card Header with title and optional subtitle
 */
export function CardHeader({ title, subtitle, action, divider = false }) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" component="h3" gutterBottom={!!subtitle}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
      {divider && <Divider sx={{ mb: 2 }} />}
    </>
  );
}

CardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  divider: PropTypes.bool,
};

/**
 * Card Content wrapper
 */
export function CardContent({ children, sx = {} }) {
  return <MuiCardContent sx={{ p: 0, '&:last-child': { pb: 0 }, ...sx }}>{children}</MuiCardContent>;
}

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};

/**
 * Card Actions wrapper
 */
export function CardActions({ children, sx = {} }) {
  return (
    <MuiCardActions
      sx={{
        p: 0,
        pt: 2,
        justifyContent: 'flex-end',
        ...sx,
      }}
    >
      {children}
    </MuiCardActions>
  );
}

CardActions.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};
