import React from 'react'

import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'

import DirectionBusIcon from '@mui/icons-material/DirectionsBusRounded'

import { useViewStateValue } from './context/viewState'

import * as utilsHelper from './helpers/utils'

const MobileAvatar = props => {
  const [{ mapZoom }] = useViewStateValue()
  const { location, organisation } = props

  const status = location.getStatus()
  const size = mapZoom[0] < 8 ? 'small' : mapZoom[0] < 12 ? 'medium' : 'large'
  const border = mapZoom[0] < 8 ? 2 : mapZoom[0] < 12 ? 3 : 4

  return (
    <Tooltip title={status ? status.textFormat : ''}>
      <Fab
        size={size}
        color='primary'
        style={{
          backgroundColor: utilsHelper.hextoRGBA(organisation.colour, 0.8),
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

export default MobileAvatar
