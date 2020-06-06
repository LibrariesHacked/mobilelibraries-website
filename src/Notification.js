import React from 'react'

// Material UI
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'

// Icons
import CloseIcon from '@material-ui/icons/CloseTwoTone'

function Notification (props) {
  const handleClose = props.close

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={props.open}
      autoHideDuration={4000}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={<span id='message-id'>{props.message}</span>}
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
