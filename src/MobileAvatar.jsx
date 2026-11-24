import React, { useMemo } from 'react'

import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'

import DirectionBusIcon from '@mui/icons-material/DirectionsBusRounded'

import * as utilsHelper from './helpers/utils'

/**
 * Map marker icon representing a mobile library vehicle, coloured by its local authority.
 * @param {Object} props - Component props.
 * @param {string} [props.label] - Mobile library name for the accessible marker label.
 * @param {import('./models/mobiles').MobileLocation} [props.location] - Vehicle location and status.
 * @param {import('./models/localAuthorities').LocalAuthority} [props.localAuthority] - Owning local library authority.
 * @param {'small' | 'medium' | 'large'} [props.size='small'] - Marker button size.
 * @returns {JSX.Element} MobileAvatar element.
 */
const MobileAvatar = props => {
  const { label, location, localAuthority, size = 'small' } = props
  const theme = useTheme()

  const statusText = useMemo(() => {
    const status = location ? location.getStatus() : null
    return status ? status.textFormat : ''
  }, [location])

  const backgroundColor = useMemo(() => {
    return localAuthority
      ? localAuthority.getRgbaColour(0.8)
      : utilsHelper.hextoRGBA(theme.palette.primary.main, 0.8)
  }, [localAuthority, theme.palette.primary.main])

  const border = size === 'small' ? 2 : size === 'medium' ? 3 : 4
  const ariaLabel = [
    label ||
      (localAuthority
        ? `${localAuthority.name} mobile library`
        : 'Mobile library'),
    statusText
  ]
    .filter(Boolean)
    .join(': ')

  return (
    <Tooltip title={statusText} describeChild>
      <Fab
        component='div'
        size={size}
        role='img'
        tabIndex={-1}
        aria-label={ariaLabel}
        style={{
          backgroundColor,
          borderWidth: border,
          borderColor: theme.palette.common.white,
          borderStyle: 'solid'
        }}
      >
        <DirectionBusIcon />
      </Fab>
    </Tooltip>
  )
}

export default React.memo(MobileAvatar)
