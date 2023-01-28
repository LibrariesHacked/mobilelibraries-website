import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import useMediaQuery from '@mui/material/useMediaQuery'

import CancelIcon from '@mui/icons-material/CancelTwoTone'

import { useTheme } from '@mui/material/styles'

import makeStyles from '@mui/styles/makeStyles'

import { useViewStateValue } from './context/viewState'

const useStyles = makeStyles(() => ({
  dialog: {
    border: '1px solid #E0E0E0'
  }
}))

function MapSettings () {
  const [{ mapSettings, mapSettingsDialogOpen }, dispatchView] =
    useViewStateValue()

  const closeDialog = () => {
    dispatchView({ type: 'SetMapSettingsDialog', mapSettingsDialogOpen: false })
  }

  const handleAuthorityBoundaryChange = () => {
    dispatchView({ type: 'ToggleMapSetting', mapSetting: 'authorityBoundary' })
  }

  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={mapSettingsDialogOpen}
      onClose={closeDialog}
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
              name='sw_authority_boundary'
              color='primary'
            />
          }
          label='Library service boundaries'
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color='secondary'
          endIcon={<CancelIcon />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MapSettings
