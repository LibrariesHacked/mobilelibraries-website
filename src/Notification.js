import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'

import CloseIcon from '@material-ui/icons/CloseTwoTone'

import { useViewStateValue } from './context/viewState'

function Notification () {
  const [{ notificationOpen, notificationMessage }, dispatchView] = useViewStateValue() //eslint-disable-line

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
        >
          <CloseIcon color='inherit' />
        </IconButton>
      ]}
    />
  )
}

export default Notification
