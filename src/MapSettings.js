import React from 'react'

// Material UI
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import useMediaQuery from '@material-ui/core/useMediaQuery'

// Material UI Styles
import { useTheme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    border: '1px solid #E0E0E0'
  }
}))

function MapSettings (mapSettings, toggleMapSetting, close, open) {
  const handleAuthorityBoundaryChange = () => toggleMapSetting('authorityBoundary')

  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      fullScreen={fullScreen}
      disableBackdropClick
      open={open}
      onClose={close}
      BackdropProps={{
        invisible: true
      }}
      PaperProps={{ elevation: 0, className: classes.dialog }}
    >
      <DialogTitle>Map settings</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Switch
              checked={mapSettings.authorityBoundary}
              onChange={handleAuthorityBoundaryChange}
              name='sw_authorityBoundary'
              color='primary'
            />
          }
          label='Library service boundaries'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close()} color='secondary'>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default MapSettings
