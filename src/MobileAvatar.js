// React
import React from 'react'

// Material UI
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

// MUI Icons
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone'

// Material UI Styles
import { makeStyles } from '@material-ui/core/styles'

import { useViewStateValue } from './context/viewState'

// Helpers
import * as utilsHelper from './helpers/utils'

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(1),
    boxShadow: 'none'
  }
}))

function MobileAvatar (props) {
  const [{ mapZoom }] = useViewStateValue()
  const { location, organisation } = props

  const status = location.getStatus()
  const size = (mapZoom[0] < 8 ? 'small' : (mapZoom[0] < 12 ? 'medium' : 'large'))
  const border = (mapZoom[0] < 8 ? 2 : (mapZoom[0] < 12 ? 3 : 4))
  const classes = useStyles()

  return (
    <Tooltip
      title={(status ? status.textFormat : '')}
    >
      <Fab
        size={size}
        className={classes.fab}
        color='primary'
        style={{
          backgroundColor: utilsHelper.hextoRGBA(organisation.colour, 0.8),
          color: 'white',
          border: (border + 'px solid #FFFFFF')
        }}
      >
        <DirectionBusIcon />
      </Fab>
    </Tooltip>
  )
}

export default MobileAvatar
