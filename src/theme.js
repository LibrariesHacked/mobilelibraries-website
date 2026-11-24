import { alpha, createTheme } from '@mui/material/styles'
import { common } from '@mui/material/colors'

const HEADING_FONT_FAMILY =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
const BODY_FONT_FAMILY =
  "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

/** Single uniform corner radius (8px) applied consistently across the style guide and all components. */
const UNIFORM_BORDER_RADIUS = 8

/**
 * Base Material UI theme defining the centralized `palette`, shadows, and uniform border radius.
 */
let theme = createTheme({
  shadows: Array(25).fill('none'),
  palette: {
    common: {
      white: common.white
    },
    primary: {
      main: '#3E6B2F',
      light: '#6E9A5B',
      dark: '#264A1B',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#F2A91E',
      light: '#F6C05A',
      dark: '#B97C00',
      contrastText: '#1F3A18'
    },
    tertiary: {
      main: '#C4622D',
      light: '#D48153',
      dark: '#96471D',
      contrastText: '#FFFFFF'
    },
    warmNeutral: {
      main: '#9A5A22',
      cream: '#F6EBC8',
      sand: '#E8D7A4'
    },
    background: {
      default: '#FBF5E3',
      paper: '#FFFFFF',
      subtle: '#F6EBC8'
    },
    text: {
      primary: '#1F3A18',
      secondary: '#4A5F43'
    },
    success: {
      main: '#8DB66A',
      dark: '#5C873A',
      contrastText: '#1F3A18'
    },
    warning: {
      main: '#B97C00',
      light: '#F2A91E',
      dark: '#8A5B00',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#B8332A',
      light: '#D15B52',
      dark: '#871F18',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#2B6CB0',
      light: '#5A9BD5',
      dark: '#1E4E8C',
      contrastText: '#FFFFFF'
    },
    divider: alpha('#6E9A5B', 0.25)
  },
  shape: {
    borderRadius: UNIFORM_BORDER_RADIUS
  }
})

/**
 * Composed Material UI theme referencing `theme.palette` and `theme.shape.borderRadius`
 * for typography, borderless block buttons and dropdowns, and soft complementary outlines.
 */
theme = createTheme(theme, {
  typography: {
    fontFamily: BODY_FONT_FAMILY,
    h1: {
      fontFamily: HEADING_FONT_FAMILY,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: theme.palette.primary.main
    },
    h2: {
      fontFamily: HEADING_FONT_FAMILY,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: theme.palette.primary.main
    },
    h3: {
      fontFamily: HEADING_FONT_FAMILY,
      fontWeight: 800,
      letterSpacing: '-0.01em',
      color: theme.palette.primary.main
    },
    h4: {
      fontFamily: HEADING_FONT_FAMILY,
      fontWeight: 800,
      letterSpacing: '-0.01em',
      color: theme.palette.primary.main
    },
    h5: {
      fontFamily: HEADING_FONT_FAMILY,
      fontWeight: 800,
      color: theme.palette.text.primary
    },
    h6: {
      fontFamily: HEADING_FONT_FAMILY,
      fontWeight: 800,
      fontSize: '1.05rem',
      color: theme.palette.text.primary
    },
    subtitle1: {
      fontFamily: HEADING_FONT_FAMILY,
      fontWeight: 700,
      color: theme.palette.text.secondary
    },
    subtitle2: {
      fontFamily: HEADING_FONT_FAMILY,
      fontWeight: 700,
      fontSize: '0.875rem',
      color: theme.palette.text.secondary
    },
    caption: {
      fontFamily: HEADING_FONT_FAMILY,
      fontWeight: 700,
      color: theme.palette.text.secondary
    },
    body1: {
      fontFamily: BODY_FONT_FAMILY,
      fontWeight: 400,
      color: theme.palette.text.primary
    },
    body2: {
      fontFamily: BODY_FONT_FAMILY,
      fontWeight: 400,
      color: theme.palette.text.secondary
    },
    button: {
      fontFamily: HEADING_FONT_FAMILY,
      fontWeight: 700,
      textTransform: 'none'
    }
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          border: 'none',
          backgroundImage: 'none'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        color: 'primary',
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontFamily: HEADING_FONT_FAMILY,
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: theme.shape.borderRadius,
          padding: '7px 14px',
          border: 'none',
          transition: 'background-color 0.15s ease, color 0.15s ease'
        },
        sizeSmall: {
          padding: '5px 11px',
          fontSize: '0.84rem'
        },
        containedPrimary: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        },
        containedSecondary: {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.secondary.light
          }
        },
        outlined: {
          border: 'none',
          backgroundColor: alpha(theme.palette.primary.light, 0.14),
          color: theme.palette.primary.main,
          '&:hover': {
            border: 'none',
            backgroundColor: alpha(theme.palette.primary.light, 0.24)
          }
        },
        textPrimary: {
          backgroundColor: 'transparent',
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.14)
          }
        },
        textSecondary: {
          backgroundColor: 'transparent',
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.12),
            color: theme.palette.text.primary
          }
        }
      }
    },
    MuiIconButton: {
      defaultProps: {
        color: 'primary'
      },
      styleOverrides: {
        root: {
          minWidth: 36,
          minHeight: 36,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: 'transparent',
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.16),
            color: theme.palette.primary.dark
          }
        },
        colorSecondary: {
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.tertiary.main, 0.12),
            color: theme.palette.tertiary.main
          }
        }
      }
    },
    MuiFab: {
      defaultProps: {
        color: 'primary'
      },
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
          color: theme.palette.common.white,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: 'none'
          },
          '&:active': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          border: 'none',
          backgroundColor: theme.palette.background.paper,
          transition: 'background-color 0.15s ease'
        }
      }
    },
    MuiChip: {
      defaultProps: {
        color: 'primary',
        variant: 'filled'
      },
      styleOverrides: {
        root: {
          fontFamily: HEADING_FONT_FAMILY,
          fontWeight: 700,
          minHeight: 32,
          borderRadius: theme.shape.borderRadius,
          border: 'none'
        },
        filledPrimary: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          },
          '& .MuiChip-deleteIcon': {
            color: alpha(theme.palette.common.white, 0.8),
            '&:hover': {
              color: theme.palette.common.white
            }
          }
        },
        filledSecondary: {
          backgroundColor: theme.palette.warmNeutral.cream,
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.warmNeutral.sand
          }
        },
        deleteIcon: {
          fontSize: '1.15rem',
          padding: 2
        }
      }
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover'
      },
      styleOverrides: {
        root: {
          fontFamily: HEADING_FONT_FAMILY,
          color: theme.palette.primary.main,
          fontWeight: 700,
          '&:hover': {
            color: theme.palette.primary.dark
          }
        }
      }
    },
    MuiMenu: {
      defaultProps: {
        slotProps: {
          paper: {
            elevation: 0
          }
        }
      },
      styleOverrides: {
        paper: {
          borderRadius: theme.shape.borderRadius,
          border: 'none',
          backgroundColor: theme.palette.background.paper,
          boxShadow: `0 8px 24px ${alpha(theme.palette.text.primary, 0.12)}`,
          marginTop: 6
        },
        list: {
          padding: 6,
          '& .MuiListSubheader-root': {
            textAlign: 'left',
            paddingLeft: 12,
            paddingRight: 12,
            color: theme.palette.primary.main,
            fontWeight: 800
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: BODY_FONT_FAMILY,
          fontWeight: 600,
          minHeight: 38,
          borderRadius: theme.shape.borderRadius,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.14)
          },
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.light, 0.18),
            color: theme.palette.primary.dark,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.light, 0.24)
            }
          }
        }
      }
    },
    MuiDialog: {
      defaultProps: {
        fullWidth: true,
        maxWidth: 'sm',
        slotProps: {
          backdrop: {
            sx: {
              backgroundColor: alpha(theme.palette.text.primary, 0.4)
            }
          },
          paper: {
            elevation: 0
          }
        }
      },
      styleOverrides: {
        paper: {
          borderRadius: theme.shape.borderRadius,
          border: 'none',
          boxShadow: `0 12px 32px ${alpha(theme.palette.text.primary, 0.18)}`
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: HEADING_FONT_FAMILY,
          fontSize: '1.2rem',
          fontWeight: 800,
          color: theme.palette.primary.main
        }
      }
    },
    MuiDialogContent: {
      defaultProps: {
        dividers: false
      }
    },
    MuiListSubheader: {
      defaultProps: {
        disableSticky: true,
        disableGutters: true
      },
      styleOverrides: {
        root: {
          fontFamily: HEADING_FONT_FAMILY,
          backgroundColor: 'transparent',
          color: theme.palette.text.secondary,
          fontWeight: 700,
          lineHeight: '2rem',
          textAlign: 'center'
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.default,
          border: 'none',
          borderRadius: theme.shape.borderRadius,
          marginBottom: 16
        }
      }
    },
    MuiTable: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          padding: '8px 12px'
        },
        head: {
          fontFamily: HEADING_FONT_FAMILY,
          fontWeight: 700,
          color: theme.palette.text.secondary,
          backgroundColor: 'transparent'
        }
      }
    }
  }
})

export default theme
