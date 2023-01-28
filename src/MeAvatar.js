import React from 'react'

import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'

import makeStyles from '@mui/styles/makeStyles'

import { useSearchStateValue } from './context/searchState'

import Face from '@mui/icons-material/FaceTwoTone'

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

function MeAvatar () {
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
