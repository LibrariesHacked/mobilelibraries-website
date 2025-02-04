import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import ListSubheader from '@mui/material/ListSubheader'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import CancelIcon from '@mui/icons-material/CancelTwoTone'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

const MobileLibraryDetails = () => {
  const [{ mobileLookup }] = useApplicationStateValue()
  const [{ currentMobileLibraryId }] = useSearchStateValue()
  const [{ mobileLibraryDialogOpen }, dispatchView] = useViewStateValue()

  const [mobileLibrary, setMobileLibrary] = useState({})

  useEffect(() => {
    if (currentMobileLibraryId != null && mobileLookup) { setMobileLibrary(mobileLookup[currentMobileLibraryId]) }
  }, [currentMobileLibraryId, mobileLookup])

  const close = () => {
    dispatchView({
      type: 'SetMobileLibraryDialog',
      mobileLibraryDialogOpen: false
    })
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={mobileLibraryDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
      BackdropProps={{ invisible: true }}
      PaperProps={{ elevation: 0 }}
    >
      {mobileLibrary
        ? (
          <>
            <DialogTitle id='dlg-title'>{mobileLibrary.name}</DialogTitle>
            <DialogContent>
              <ListSubheader disableSticky>Actions</ListSubheader>
              <div />
            </DialogContent>
          </>
          )
        : (
          <CircularProgress color='primary' size={30} />
          )}
      <DialogActions>
        <Button
          onClick={() => close()}
          color='secondary'
          endIcon={<CancelIcon />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MobileLibraryDetails
