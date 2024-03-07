import React from 'react'

import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'

import CloseIcon from '@mui/icons-material/CloseTwoTone'

import { useViewStateValue } from './context/viewState'

function Notification () {
  const [{ notificationOpen, notificationMessage }, dispatchView] =
    useViewStateValue() //eslint-disable-line

  const handleClose = () => {
    dispatchView({ type: 'SetNotification', notificationOpen: false })
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={notificationOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={<span id='message-id'>{notificationMessage}</span>}
      action={[
        <IconButton
          key='close'
          aria-label='close'
          onClick={handleClose}
          color='secondary'
          size='large'
        >
          <CloseIcon />
        </IconButton>
      ]}
    />
  )
}

export default Notification
