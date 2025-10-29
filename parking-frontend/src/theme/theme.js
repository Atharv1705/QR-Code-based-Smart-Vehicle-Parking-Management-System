import { createTheme } from '@mui/material/styles';

// Create theme function that accepts mode parameter
export const createAppTheme = (mode = 'light') => {
  const isLight = mode === 'light';
  
  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    spacing: 8, // Consistent 8px spacing unit
    palette: {
      mode,
      primary: {
        main: '#0066cc',
        light: '#3399ff',
        dark: '#004c99',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6a3de8',
        light: '#8c6df0',
        dark: '#4d1bd6',
        contrastText: '#ffffff',
      },
      success: {
        main: '#00a86b',
        light: '#33c18b',
        dark: '#007d4f',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#ff9500',
        light: '#ffb04d',
        dark: '#cc7600',
        contrastText: '#ffffff',
      },
      error: {
        main: '#e53935',
        light: '#eb6765',
        dark: '#b71c1c',
        contrastText: '#ffffff',
      },
      info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
        contrastText: '#ffffff',
      },
      background: {
        default: isLight ? '#f9fafb' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: isLight ? '#111827' : '#f3f4f6',
        secondary: isLight ? '#4b5563' : '#9ca3af',
      },
      divider: isLight ? '#e5e7eb' : '#374151',
      action: {
        active: isLight ? 'rgba(0, 102, 204, 0.54)' : 'rgba(51, 153, 255, 0.7)',
        hover: isLight ? 'rgba(0, 102, 204, 0.04)' : 'rgba(51, 153, 255, 0.08)',
        selected: isLight ? 'rgba(0, 102, 204, 0.08)' : 'rgba(51, 153, 255, 0.16)',
        disabled: isLight ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)',
        disabledBackground: isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.75rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
        marginBottom: '0.5em',
        '@media (max-width:600px)': {
          fontSize: '2.25rem',
        },
      },
      h2: {
        fontSize: '2.25rem',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        marginBottom: '0.5em',
        '@media (max-width:600px)': {
          fontSize: '1.875rem',
        },
      },
      h3: {
        fontSize: '1.875rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        marginBottom: '0.5em',
        '@media (max-width:600px)': {
          fontSize: '1.5rem',
        },
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '-0.01em',
        marginBottom: '0.5em',
        '@media (max-width:600px)': {
          fontSize: '1.25rem',
        },
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: '0.5em',
        '@media (max-width:600px)': {
          fontSize: '1.125rem',
        },
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: '0.5em',
        '@media (max-width:600px)': {
          fontSize: '1rem',
        },
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        marginBottom: '1em',
        '@media (max-width:600px)': {
          fontSize: '0.9375rem',
        },
      },
      body2: {
        fontSize: '0.9375rem',
        lineHeight: 1.6,
        marginBottom: '0.75em',
        '@media (max-width:600px)': {
          fontSize: '0.875rem',
        },
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      isLight 
        ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
        : '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
      isLight
        ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      isLight
        ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
        : '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      isLight
        ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
        : '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight
        ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '10px 24px',
            boxShadow: 'none',
            minHeight: 42,
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isLight 
                ? '0 6px 10px -2px rgba(0, 0, 0, 0.15)'
                : '0 6px 10px -2px rgba(0, 0, 0, 0.35)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            background: isLight 
              ? 'linear-gradient(145deg, #0066cc, #0077e6)'
              : 'linear-gradient(145deg, #004c99, #0066cc)',
            '&:hover': {
              background: isLight 
                ? 'linear-gradient(145deg, #0077e6, #0088ff)'
                : 'linear-gradient(145deg, #0066cc, #0077e6)',
              boxShadow: isLight
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
            },
          },
          containedSecondary: {
            background: isLight 
              ? 'linear-gradient(145deg, #6a3de8, #7b4ef9)'
              : 'linear-gradient(145deg, #4d1bd6, #6a3de8)',
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
            },
          },
          small: {
            padding: '6px 16px',
            minHeight: 36,
            fontSize: '0.875rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isLight
              ? '0 4px 20px rgba(0, 0, 0, 0.08)'
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: isLight ? '1px solid rgba(229, 231, 235, 0.8)' : '1px solid rgba(55, 65, 81, 0.8)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isLight
                ? '0 8px 30px rgba(0, 0, 0, 0.12)'
                : '0 8px 30px rgba(0, 0, 0, 0.4)',
            },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '24px',
            '&:last-child': {
              paddingBottom: '24px',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: '16px',
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 30, 30, 0.8)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isLight ? '#0066cc' : '#3399ff',
                  borderWidth: '2px',
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isLight ? '#0066cc' : '#3399ff',
                  borderWidth: 2,
                  boxShadow: isLight ? '0 0 0 3px rgba(0, 102, 204, 0.15)' : '0 0 0 3px rgba(51, 153, 255, 0.25)',
                },
              },
            },
            '& .MuiInputBase-input': {
              padding: '14px 16px',
              fontSize: '1rem',
            },
            '& .MuiInputBase-inputSizeSmall': {
              padding: '10px 14px',
              fontSize: '0.9375rem',
            },
            '& .MuiFormLabel-root': {
              fontSize: '0.9375rem',
              fontWeight: 500,
              '&.Mui-focused': {
                color: isLight ? '#0066cc' : '#3399ff',
              },
            },
            '& .MuiFormHelperText-root': {
              marginLeft: '4px',
              fontSize: '0.8125rem',
            },
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: '24px',
            paddingRight: '24px',
            '@media (min-width: 600px)': {
              paddingLeft: '32px',
              paddingRight: '32px',
            },
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
        },
      },
      MuiGrid: {
        styleOverrides: {
          container: {
            width: '100%',
            margin: 0,
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '24px',
          },
          item: {
            paddingLeft: '0px !important',
            paddingTop: '0px !important',
            display: 'flex',
            justifyContent: 'center',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: isLight
              ? '0 2px 10px rgba(0, 0, 0, 0.08)'
              : '0 2px 10px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            backgroundColor: isLight 
              ? 'rgba(255, 255, 255, 0.9)' 
              : 'rgba(18, 18, 18, 0.9)',
            borderBottom: isLight 
              ? '1px solid rgba(229, 231, 235, 0.8)' 
              : '1px solid rgba(55, 65, 81, 0.8)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRight: isLight ? '1px solid rgba(229, 231, 235, 0.8)' : '1px solid rgba(55, 65, 81, 0.8)',
            boxShadow: isLight
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            margin: '6px 16px',
            padding: '10px 16px',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: isLight 
                ? 'rgba(0, 102, 204, 0.08)'
                : 'rgba(51, 153, 255, 0.16)',
              transform: 'translateX(4px)',
            },
            '&.Mui-selected': {
              backgroundColor: isLight 
                ? 'rgba(0, 102, 204, 0.12)'
                : 'rgba(51, 153, 255, 0.24)',
              color: isLight ? '#0066cc' : '#3399ff',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: isLight 
                  ? 'rgba(0, 102, 204, 0.16)'
                  : 'rgba(51, 153, 255, 0.32)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '25%',
                height: '50%',
                width: '4px',
                backgroundColor: isLight ? '#0066cc' : '#3399ff',
                borderRadius: '0 4px 4px 0',
              },
            },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            height: '100%',
            margin: 0,
            padding: 0,
            scrollBehavior: 'smooth',
          },
          body: {
            height: '100%',
            margin: 0,
            padding: 0,
            overflow: 'auto',
            transition: 'background-color 0.3s ease',
          },
          '#root': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
          '*': {
            boxSizing: 'border-box',
          },
          '*::-webkit-scrollbar': {
            width: '10px',
            height: '10px',
          },
          '*::-webkit-scrollbar-track': {
            background: isLight ? '#f1f5f9' : '#1e1e1e',
            borderRadius: '8px',
          },
          '*::-webkit-scrollbar-thumb': {
            background: isLight ? '#cbd5e1' : '#4b5563',
            borderRadius: '8px',
            border: isLight ? '2px solid #f1f5f9' : '2px solid #1e1e1e',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: isLight ? '#94a3b8' : '#64748b',
          },
          'a': {
            color: isLight ? '#0066cc' : '#3399ff',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: isLight ? '#004c99' : '#66b3ff',
              textDecoration: 'underline',
            },
          },
          '.MuiPaper-elevation1': {
            boxShadow: isLight 
              ? '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)'
              : '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3)',
          },
          '.MuiPaper-elevation2': {
            boxShadow: isLight 
              ? '0 3px 6px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.12)'
              : '0 3px 6px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.3)',
          },
        },
      },
          // Add keyframes for gradient animations
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          },
    },
  });
};

// Default light theme
const theme = createAppTheme('light');

export default theme;