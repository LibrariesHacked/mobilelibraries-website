import React from 'react'

// Material UI
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'

// Icons
import CloseIcon from '@material-ui/icons/CloseTwoTone'

// Styling
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  close: {

  }
}))

function Notification (props) {
  const classes = useStyles()

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
          className={classes.close}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      ]}
    />
  )
}

export default Notification
