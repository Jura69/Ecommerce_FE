import { createTheme } from '@mui/material/styles';

// ═══════════════════════════════════════════════
//  DESIGN SYSTEM: Liquid Glass — E-Commerce
//  Style: Premium, warm, sophisticated
//  Palette: Stone + Gold accent
//  Typography: Rubik (headings) + Nunito Sans (body)
// ═══════════════════════════════════════════════

// Design tokens
export const tokens = {
  colors: {
    stone50: '#FAFAF9',
    stone100: '#F5F5F4',
    stone200: '#E7E5E4',
    stone300: '#D6D3D1',
    stone400: '#A8A29E',
    stone500: '#78716C',
    stone600: '#57534E',
    stone700: '#44403C',
    stone800: '#292524',
    stone900: '#1C1917',
    stone950: '#0C0A09',
    gold50: '#FFFBEB',
    gold100: '#FEF3C7',
    gold200: '#FDE68A',
    gold300: '#FCD34D',
    gold400: '#FBBF24',
    gold500: '#F59E0B',
    gold600: '#CA8A04',
    gold700: '#A16207',
    gold800: '#854D0E',
    white: '#FFFFFF',
    black: '#000000',
    success: '#16A34A',
    successBg: '#F0FDF4',
    error: '#DC2626',
    errorBg: '#FEF2F2',
    warning: '#D97706',
    warningBg: '#FFFBEB',
    info: '#2563EB',
    infoBg: '#EFF6FF',
  },
  gradients: {
    gold: 'linear-gradient(135deg, #CA8A04 0%, #F59E0B 50%, #CA8A04 100%)',
    goldSubtle: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    warmDark: 'linear-gradient(135deg, #1C1917 0%, #292524 50%, #1C1917 100%)',
    warmLight: 'linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 100%)',
    hero: 'linear-gradient(135deg, #1C1917 0%, #292524 40%, #44403C 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    glassCard: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,249,0.9) 100%)',
    accent: 'linear-gradient(135deg, #CA8A04 0%, #D97706 100%)',
  },
  shadows: {
    sm: '0 1px 2px rgba(28, 25, 23, 0.05)',
    md: '0 4px 12px rgba(28, 25, 23, 0.08)',
    lg: '0 8px 24px rgba(28, 25, 23, 0.1)',
    xl: '0 16px 40px rgba(28, 25, 23, 0.12)',
    gold: '0 4px 16px rgba(202, 138, 4, 0.2)',
    goldHover: '0 8px 24px rgba(202, 138, 4, 0.3)',
    card: '0 1px 3px rgba(28, 25, 23, 0.06), 0 1px 2px rgba(28, 25, 23, 0.04)',
    cardHover: '0 10px 30px rgba(28, 25, 23, 0.1)',
  },
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1C1917',
      light: '#44403C',
      dark: '#0C0A09',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#CA8A04',
      light: '#F59E0B',
      dark: '#A16207',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#B91C1C',
    },
    warning: {
      main: '#D97706',
      light: '#F59E0B',
      dark: '#B45309',
    },
    info: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
    },
    success: {
      main: '#16A34A',
      light: '#22C55E',
      dark: '#15803D',
    },
    background: {
      default: '#FAFAF9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1917',
      secondary: '#57534E',
    },
    divider: '#E7E5E4',
  },
  typography: {
    fontFamily: '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '2.75rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.25,
    },
    h3: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '1.875rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h5: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.45,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.55,
      letterSpacing: '0.01em',
    },
    button: {
      fontFamily: '"Rubik", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    overline: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FAFAF9',
          color: '#1C1917',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid #E7E5E4',
          boxShadow: '0 1px 3px rgba(28, 25, 23, 0.04)',
          color: '#1C1917',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          background: '#1C1917',
          color: '#FFFFFF',
          boxShadow: tokens.shadows.sm,
          '&:hover': {
            background: '#292524',
            boxShadow: tokens.shadows.md,
          },
        },
        containedSecondary: {
          background: tokens.gradients.gold,
          color: '#FFFFFF',
          boxShadow: tokens.shadows.gold,
          '&:hover': {
            boxShadow: tokens.shadows.goldHover,
          },
        },
        outlined: {
          borderWidth: '1.5px',
          borderColor: '#D6D3D1',
          color: '#1C1917',
          '&:hover': {
            borderWidth: '1.5px',
            borderColor: '#1C1917',
            background: 'rgba(28, 25, 23, 0.04)',
          },
        },
        text: {
          color: '#57534E',
          '&:hover': {
            background: 'rgba(28, 25, 23, 0.04)',
            color: '#1C1917',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          border: '1px solid #E7E5E4',
          borderRadius: 16,
          boxShadow: tokens.shadows.card,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: tokens.shadows.cardHover,
            borderColor: '#D6D3D1',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: tokens.shadows.card,
          border: '1px solid #E7E5E4',
        },
        elevation2: {
          boxShadow: tokens.shadows.md,
          border: '1px solid #E7E5E4',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            background: '#FFFFFF',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: '#D6D3D1',
              borderWidth: '1.5px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            '&:hover fieldset': {
              borderColor: '#A8A29E',
            },
            '&.Mui-focused': {
              background: '#FFFFFF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#CA8A04',
              borderWidth: '2px',
              boxShadow: '0 0 0 3px rgba(202, 138, 4, 0.1)',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#CA8A04',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.8125rem',
        },
        filled: {
          background: '#F5F5F4',
          color: '#44403C',
          border: '1px solid #E7E5E4',
          '&:hover': {
            background: '#E7E5E4',
          },
        },
        colorSecondary: {
          background: '#FEF3C7',
          color: '#A16207',
          border: '1px solid #FDE68A',
        },
        colorSuccess: {
          background: '#F0FDF4',
          color: '#15803D',
          border: '1px solid #BBF7D0',
        },
        colorError: {
          background: '#FEF2F2',
          color: '#B91C1C',
          border: '1px solid #FECACA',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44,
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: tokens.gradients.gold,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 600,
          fontFamily: '"Rubik", sans-serif',
          fontSize: '0.9375rem',
          minHeight: 44,
          color: '#78716C',
          '&.Mui-selected': {
            color: '#1C1917',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          border: '1px solid',
        },
        standardSuccess: {
          background: '#F0FDF4',
          borderColor: '#BBF7D0',
          color: '#15803D',
        },
        standardError: {
          background: '#FEF2F2',
          borderColor: '#FECACA',
          color: '#B91C1C',
        },
        standardWarning: {
          background: '#FFFBEB',
          borderColor: '#FDE68A',
          color: '#92400E',
        },
        standardInfo: {
          background: '#EFF6FF',
          borderColor: '#BFDBFE',
          color: '#1E40AF',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 3,
          background: '#E7E5E4',
        },
        bar: {
          background: tokens.gradients.gold,
          borderRadius: 3,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E7E5E4',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E7E5E4',
          background: '#FFFFFF',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: tokens.shadows.xl,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        colorError: {
          background: tokens.gradients.gold,
          color: '#FFFFFF',
          fontWeight: 700,
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontFamily: '"Rubik", sans-serif',
            fontWeight: 500,
            borderRadius: 8,
            '&.Mui-selected': {
              background: '#1C1917',
              color: '#FFFFFF',
              '&:hover': {
                background: '#292524',
              },
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#1C1917',
          color: '#FAFAF9',
          borderRadius: 8,
          fontSize: '0.8125rem',
          fontWeight: 500,
          padding: '6px 12px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(28, 25, 23, 0.06)',
          },
        },
      },
    },
  },
});

// Export gradients for direct use
export const gradients = tokens.gradients;
