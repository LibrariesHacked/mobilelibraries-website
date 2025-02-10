import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

import useMediaQuery from '@mui/material/useMediaQuery'

import CancelIcon from '@mui/icons-material/CancelRounded'

import { useTheme } from '@mui/material/styles'

import { useViewStateValue } from './context/viewState'

function MapSettings () {
  const [{ mapSettings, mapSettingsDialogOpen }, dispatchView] =
    useViewStateValue()

  const closeDialog = () => {
    dispatchView({ type: 'SetMapSettingsDialog', mapSettingsDialogOpen: false })
  }

  const handleAuthorityBoundaryChange = () => {
    dispatchView({ type: 'ToggleMapSetting', mapSetting: 'authorityBoundary' })
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={mapSettingsDialogOpen}
      onClose={closeDialog}
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }
      }}
      PaperProps={{ elevation: 0, sx: { border: 1, borderColor: '#ccc' } }}
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
          label='Library authority boundaries'
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
