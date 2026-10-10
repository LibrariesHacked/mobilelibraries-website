import { alpha, createTheme } from '@mui/material/styles'
import { blueGrey, green } from '@mui/material/colors'

const primaryMain = green[800]
const secondaryMain = blueGrey[700]

const theme = createTheme({
  shadows: Array(25).fill('none'),
  palette: {
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    primary: {
      main: primaryMain
    },
    secondary: {
      main: secondaryMain
    },
    text: {
      primary: blueGrey[900],
      secondary: blueGrey[600]
    },
    divider: blueGrey[100]
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.05rem'
    }
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
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
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '8px 16px'
        }
      }
    },
    MuiChip: {
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
      }
    },
    MuiDialog: {
      defaultProps: {
        fullWidth: true,
        maxWidth: 'sm',
        slotProps: {
          backdrop: {
            sx: {
              backgroundColor: 'rgba(15, 23, 42, 0.35)'
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
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          color: blueGrey[600],
          fontWeight: 600,
          lineHeight: '2rem'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 42
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: blueGrey[700],
          backgroundColor: '#f8fafc'
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: `1px solid ${blueGrey[100]}`,
          borderRadius: 8,
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none'
          },
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
            {
              outline: 'none'
            },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: `1px solid ${blueGrey[100]}`
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: alpha(primaryMain, 0.04),
            cursor: 'pointer'
          }
        },
        columnHeaderTitle: {
          fontWeight: 600,
          color: blueGrey[700]
        }
      }
    }
  },
  mixins: {
    MuiDataGrid: {
      containerBackground: '#f8fafc'
    }
  }
})

export default theme
