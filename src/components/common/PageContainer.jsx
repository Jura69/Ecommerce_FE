import PropTypes from 'prop-types';
import { Container, Box, Typography, Breadcrumbs, Link as MuiLink, Stack, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext } from '@mui/icons-material';

/**
 * Standard page container with consistent header and spacing
 */
export default function PageContainer({
  children,
  title,
  subtitle,
  breadcrumbs,
  action,
  maxWidth = 'lg',
  spacing = 4,
  sx = {},
}) {
  return (
    <Container maxWidth={maxWidth} sx={{ py: spacing, ...sx }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, index) => (
            <div key={index}>
              {crumb.href ? (
                <MuiLink
                  component={RouterLink}
                  to={crumb.href}
                  underline="hover"
                  color="inherit"
                  sx={{ fontSize: '0.875rem' }}
                >
                  {crumb.label}
                </MuiLink>
              ) : (
                <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
                  {crumb.label}
                </Typography>
              )}
            </div>
          ))}
        </Breadcrumbs>
      )}

      {/* Page Header */}
      {(title || action) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
          }}
        >
          <Box>
            {title && (
              <Typography variant="h4" component="h1" gutterBottom={!!subtitle}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && <Box>{action}</Box>}
        </Box>
      )}

      {/* Page Content */}
      {children}
    </Container>
  );
}

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
  action: PropTypes.node,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  spacing: PropTypes.number,
  sx: PropTypes.object,
};

/**
 * Section component with optional title and divider
 */
export function Section({ children, title, subtitle, divider = false, spacing = 3, sx = {} }) {
  return (
    <Box sx={{ mb: spacing, ...sx }}>
      {title && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom={!!subtitle}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      {divider && <Divider sx={{ mb: 2 }} />}
      {children}
    </Box>
  );
}

Section.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  divider: PropTypes.bool,
  spacing: PropTypes.number,
  sx: PropTypes.object,
};

/**
 * Responsive grid layout with predefined variants
 */
export function GridLayout({ children, variant = 'cards', spacing = 3, sx = {} }) {
  const variantStyles = {
    // 3 cols desktop, 2 tablet, 1 mobile
    cards: {
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      },
      gap: spacing,
    },
    // 4 cols desktop, 2 tablet, 1 mobile
    dashboard: {
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(4, 1fr)',
      },
      gap: spacing,
    },
    // Full width items with dividers
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing,
    },
    // 2 cols desktop, 1 mobile
    twoColumn: {
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        md: 'repeat(2, 1fr)',
      },
      gap: spacing,
    },
  };

  return <Box sx={{ ...variantStyles[variant], ...sx }}>{children}</Box>;
}

GridLayout.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['cards', 'dashboard', 'list', 'twoColumn']),
  spacing: PropTypes.number,
  sx: PropTypes.object,
};
