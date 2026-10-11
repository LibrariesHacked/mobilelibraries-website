import React, { useMemo } from 'react'

import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'

import DirectionBusIcon from '@mui/icons-material/DirectionsBusRounded'

import * as utilsHelper from './helpers/utils'

const MobileAvatar = props => {
  const { location, organisation, size = 'small' } = props

  const statusText = useMemo(() => {
    const status = location ? location.getStatus() : null
    return status ? status.textFormat : ''
  }, [location])

  const backgroundColor = useMemo(() => {
    const colour = organisation && organisation.colour
      ? organisation.colour
      : '#2e7d32'
    return utilsHelper.hextoRGBA(colour, 0.8)
  }, [organisation])

  const border = size === 'small' ? 2 : size === 'medium' ? 3 : 4

  return (
    <Tooltip title={statusText}>
      <Fab
        size={size}
        color='primary'
        style={{
          backgroundColor,
          color: 'white',
          borderWidth: border,
          borderColor: 'white',
          borderStyle: 'solid'
        }}
      >
        <DirectionBusIcon />
      </Fab>
    </Tooltip>
  )
}

export default React.memo(MobileAvatar)
