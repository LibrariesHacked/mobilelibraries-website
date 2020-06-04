// React
import React from 'react'

// Material UI
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

// MUI Icons
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone'

// Material UI Styles
import { makeStyles } from '@material-ui/core/styles'

// Helpers
import { MobileLocation } from './helpers/mobiles'
import * as utilsHelper from './helpers/utils'

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(1),
    boxShadow: 'none'
  }
}))

function MobileAvatar (props) {
  const { location, organisation, zoom } = props

  const status = Object.assign(MobileLocation, location).getStatus()
  const size = (zoom < 8 ? 'small' : (zoom < 12 ? 'medium' : 'large'))
  const border = (zoom < 8 ? 2 : (zoom < 12 ? 3 : 4))
  const classes = useStyles()

  return (
    <Tooltip
      title={(status ? status.text_format : '')}
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
