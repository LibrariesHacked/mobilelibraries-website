import React from 'react'

import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'

import Face from '@mui/icons-material/FaceRounded'

const MeAvatar = () => {
  return (
    <Tooltip title='Me'>
      <Avatar color='primary'>
        <Face />
      </Avatar>
    </Tooltip>
  )
}

export default MeAvatar
