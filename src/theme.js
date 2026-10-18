import { alpha, createTheme } from '@mui/material/styles'
import { common } from '@mui/material/colors'

const HEADING_FONT_FAMILY =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
const BODY_FONT_FAMILY =
  "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

/**
 * Base Material UI theme defining the centralized `palette`, shadows, and border radius.
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
      cream: '#F6EBC8'
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
    divider: alpha('#9A5A22', 0.2),
    DataGrid: {
      headerBg: '#F6EBC8'
    }
  },
  shape: {
    borderRadius: 8
  }
})

/**
 * Composed Material UI theme referencing `theme.palette` for typography,
 * component defaults, and style overrides.
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
      fontFamily: BODY_FONT_FAMILY,
      fontWeight: 600,
      textTransform: 'none'
    }
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: 'inherit',
        elevation: 0,
        position: 'relative',
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.paper,
          borderColor: theme.palette.divider,
          marginTop: 16,
          marginBottom: 8,
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 4,
          width: 'fit-content',
          borderRadius: 12,
          zIndex: 1000,
          '& .MuiTabs-root': {
            minHeight: 44,
            borderBottom: 'none',
            marginBottom: 0
          },
          '& .MuiTabs-indicator': {
            display: 'none'
          },
          '& .MuiTab-root': {
            fontFamily: HEADING_FONT_FAMILY,
            fontWeight: 700,
            minHeight: 44,
            paddingTop: 6,
            paddingBottom: 6,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 10,
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.warmNeutral.cream, 0.6),
              color: theme.palette.primary.main
            },
            '&.Mui-selected': {
              backgroundColor: theme.palette.warmNeutral.cream,
              color: theme.palette.primary.dark
            }
          }
        }
      }
    },
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
          borderColor: theme.palette.divider,
          '&:is(footer)': {
            backgroundColor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
            paddingTop: 12,
            paddingBottom: 12,
            marginTop: 'auto',
            '& .MuiLink-root': {
              color: theme.palette.text.secondary,
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: 8,
              '&:hover': {
                color: theme.palette.primary.main
              }
            }
          }
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
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8
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
          },
          '&:active': {
            backgroundColor: theme.palette.secondary.dark
          }
        },
        outlinedPrimary: {
          borderColor: alpha(theme.palette.primary.main, 0.45),
          color: theme.palette.primary.main,
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.light, 0.12)
          }
        },
        textPrimary: {
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.14)
          }
        },
        textSecondary: {
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.secondary.main, 0.2)
          }
        },
        outlinedSecondary: {
          borderColor: alpha(theme.palette.warmNeutral.main, 0.4),
          color: theme.palette.text.primary,
          '&:hover': {
            borderColor: theme.palette.warmNeutral.main,
            backgroundColor: alpha(theme.palette.secondary.main, 0.18)
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
          minWidth: 44,
          minHeight: 44,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.14)
          }
        },
        colorSecondary: {
          color: theme.palette.tertiary.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.tertiary.main, 0.14)
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
        elevation: 0,
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: 12,
          borderColor: theme.palette.divider,
          transition: 'border-color 0.15s ease-in-out',
          '&:hover': {
            borderColor: alpha(theme.palette.warmNeutral.main, 0.45)
          }
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.warmNeutral.cream,
          borderBottom: `1px solid ${theme.palette.divider}`,
          padding: '8px 16px'
        },
        subheader: {
          fontFamily: HEADING_FONT_FAMILY,
          fontSize: '0.775rem',
          fontWeight: 700,
          color: theme.palette.primary.main
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          flexGrow: 1
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          justifyContent: 'space-between'
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
          minHeight: 36
        },
        filledPrimary: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '& .MuiChip-deleteIcon': {
            color: alpha(theme.palette.common.white, 0.8),
            '&:hover': {
              color: theme.palette.common.white
            }
          }
        },
        filledSecondary: {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText
        },
        deleteIcon: {
          fontSize: '1.25rem',
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
          color: theme.palette.primary.main,
          fontWeight: 600,
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
            elevation: 0,
            variant: 'outlined'
          }
        }
      },
      styleOverrides: {
        list: {
          '& .MuiListSubheader-root': {
            textAlign: 'left',
            paddingLeft: 16,
            paddingRight: 16
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 44,
          '&:hover': {
            backgroundColor: alpha(theme.palette.warmNeutral.cream, 0.65)
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.warmNeutral.cream,
            '&:hover': {
              backgroundColor: alpha(theme.palette.secondary.light, 0.35)
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
            elevation: 0,
            variant: 'outlined'
          }
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: HEADING_FONT_FAMILY,
          fontSize: '1.2rem',
          fontWeight: 800,
          color: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.warmNeutral.cream, 0.5)
        }
      }
    },
    MuiDialogContent: {
      defaultProps: {
        dividers: true
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
    MuiTabs: {
      defaultProps: {
        indicatorColor: 'primary',
        textColor: 'primary',
        scrollButtons: false
      },
      styleOverrides: {
        root: {
          marginBottom: 24,
          borderBottom: `1px solid ${theme.palette.divider}`
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: HEADING_FONT_FAMILY,
          textTransform: 'none',
          fontWeight: 700,
          minHeight: 48
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 8,
          marginBottom: 16
        }
      }
    },
    MuiTable: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td, &:last-child th': {
            border: 0
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontFamily: HEADING_FONT_FAMILY,
          fontWeight: 700,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.warmNeutral.cream
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 8,
          '& .MuiDataGrid-cell:focus:not(:focus-visible), & .MuiDataGrid-columnHeader:focus:not(:focus-visible)':
            {
              outline: 'none'
            },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: `1px solid ${theme.palette.divider}`
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: alpha(theme.palette.warmNeutral.cream, 0.55),
            cursor: 'pointer'
          }
        },
        columnHeaderTitle: {
          fontFamily: HEADING_FONT_FAMILY,
          fontWeight: 700,
          color: theme.palette.text.primary
        }
      }
    }
  }
})

export default theme
