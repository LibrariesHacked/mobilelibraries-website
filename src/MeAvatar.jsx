import React from 'react'

import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'

import Face from '@mui/icons-material/FaceRounded'

/**
 * Map marker avatar representing the user's searched postcode or GPS location.
 * @returns {JSX.Element} MeAvatar component.
 */
const MeAvatar = () => {
  return (
    <Tooltip title='Me'>
      <Avatar>
        <Face />
      </Avatar>
    </Tooltip>
  )
}

export default MeAvatar
