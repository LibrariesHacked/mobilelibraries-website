import React from 'react'

// Material UI
import Avatar from '@material-ui/core/Avatar'
import Tooltip from '@material-ui/core/Tooltip'

// Material UI Styles
import { makeStyles } from '@material-ui/core/styles'

import { useSearchStateValue } from './context/searchState'

// Icons
import Face from '@material-ui/icons/FaceTwoTone'

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: 0
  },
  avatarOn: {
    margin: 0,
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.main
  }
}))

function MeAvatar (props) {
  const [{ searchType }] = useSearchStateValue()

  const classes = useStyles()

  return (
    <Tooltip title='Me'>
      <Avatar
        className={searchType === 'gps' ? classes.avatarOn : classes.avatar}
      >
        <Face />
      </Avatar>
    </Tooltip>
  )
}

export default MeAvatar
