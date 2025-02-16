import { createTheme } from '@mui/material/styles'

import { blueGrey, green } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    background: {
      default: '#FFFAFA'
    },
    primary: {
      main: green[800]
    },
    secondary: {
      main: blueGrey[600]
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 48
        }
      }
    }
  }
})

export default theme
