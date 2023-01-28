import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import ListSubheader from '@mui/material/ListSubheader'

import { useTheme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import useMediaQuery from '@mui/material/useMediaQuery'

import CancelIcon from '@mui/icons-material/CancelTwoTone'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
  dialog: {
    border: '1px solid #E0E0E0'
  },
  dialogContentActions: {
    backgroundColor: '#e8f5e9',
    border: '1px solid #c8e6c9',
    borderRadius: 3,
    padding: 4
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  progress: {
    margin: theme.spacing(2)
  }
}))

function MobileLibraryDetails () {
  const [{ mobileLookup }] = useApplicationStateValue()
  const [{ currentMobileLibraryId }] = useSearchStateValue()
  const [{ mobileLibraryDialogOpen }, dispatchView] = useViewStateValue()

  const [mobileLibrary, setMobileLibrary] = useState({})

  useEffect(() => {
    if (currentMobileLibraryId != null && mobileLookup) setMobileLibrary(mobileLookup[currentMobileLibraryId])
  }, [currentMobileLibraryId, mobileLookup])

  const close = () => {
    dispatchView({ type: 'SetMobileLibraryDialog', mobileLibraryDialogOpen: false })
  }

  const theme = useTheme()
  const classes = useStyles()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={mobileLibraryDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
      BackdropProps={{ invisible: true }}
      PaperProps={{ elevation: 0, className: classes.dialog }}
    >
      {mobileLibrary
        ? (
          <>
            <DialogTitle id='dlg-title'>{mobileLibrary.name}</DialogTitle>
            <DialogContent>
              <ListSubheader disableSticky>Actions</ListSubheader>
              <div className={classes.dialogContentActions} />
            </DialogContent>
          </>
          )
        : <CircularProgress className={classes.progress} color='primary' size={30} />}
      <DialogActions>
        <Button onClick={() => close()} color='secondary' endIcon={<CancelIcon />}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default MobileLibraryDetails
