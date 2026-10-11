import { alpha, createTheme } from '@mui/material/styles'
import { blueGrey, common, green } from '@mui/material/colors'

/**
 * Base Material UI theme defining the centralized `palette`, shadows, and border radius.
 */
let theme = createTheme({
  shadows: Array(25).fill('none'),
  palette: {
    common: {
      white: common.white
    },
    background: {
      default: '#f8fafc',
      paper: common.white
    },
    primary: {
      main: green[800],
      contrastText: common.white
    },
    secondary: {
      main: blueGrey[700],
      light: blueGrey[300],
      contrastText: common.white
    },
    text: {
      primary: blueGrey[900],
      secondary: blueGrey[600]
    },
    divider: blueGrey[100]
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
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: theme.palette.text.primary
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: theme.palette.text.primary
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: theme.palette.text.primary
    },
    h5: {
      fontWeight: 600,
      color: theme.palette.text.primary
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.05rem',
      color: theme.palette.text.primary
    },
    subtitle1: {
      color: theme.palette.text.secondary
    },
    body2: {
      color: theme.palette.text.secondary
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
            minHeight: 44,
            paddingTop: 6,
            paddingBottom: 6,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 10,
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1)
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
          '&:is(footer)': {
            borderTop: `1px solid ${theme.palette.divider}`,
            paddingTop: 12,
            paddingBottom: 12,
            marginTop: 'auto',
            '& .MuiLink-root': {
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
              padding: 8
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
          fontWeight: 500
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
          minHeight: 44
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
          justifyContent: 'space-between'
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(theme.palette.primary.main, 0.06),
          borderBottom: `1px solid ${theme.palette.divider}`,
          padding: '8px 16px'
        },
        subheader: {
          fontSize: '0.75rem',
          fontWeight: 600,
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
          fontWeight: 500,
          minHeight: 36
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
          fontWeight: 500
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
          minHeight: 44
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
              backgroundColor: alpha(theme.palette.text.primary, 0.35)
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
          fontSize: '1.15rem',
          fontWeight: 600
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
          backgroundColor: 'transparent',
          color: theme.palette.text.secondary,
          fontWeight: 600,
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
          textTransform: 'none',
          fontWeight: 500,
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
          fontWeight: 600,
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.background.default
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
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            cursor: 'pointer'
          }
        },
        columnHeaderTitle: {
          fontWeight: 600,
          color: theme.palette.secondary.main
        }
      }
    }
  },
  mixins: {
    MuiDataGrid: {
      containerBackground: theme.palette.background.default
    }
  }
})

export default theme
