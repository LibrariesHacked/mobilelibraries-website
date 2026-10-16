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
    <Tooltip title='Current search location' describeChild>
      <Avatar role='img' aria-label='Your searched location'>
        <Face />
      </Avatar>
    </Tooltip>
  )
}

export default MeAvatar
