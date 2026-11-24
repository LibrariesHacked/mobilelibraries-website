import React, { useMemo } from 'react'

import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'

import DirectionBusIcon from '@mui/icons-material/DirectionsBusRounded'

import * as utilsHelper from './helpers/utils'

/**
 * Map marker icon representing a mobile library vehicle, coloured by its local authority.
 * Accepts a stable `onSelect` callback and `mobileId` so `React.memo` avoids unnecessary re-renders.
 *
 * @param {Object} props - Component props.
 * @param {number} props.mobileId - ID of the mobile library vehicle.
 * @param {string} [props.label] - Mobile library name for the accessible marker label.
 * @param {string} [props.statusText=''] - Precomputed status text.
 * @param {import('./models/localAuthorities').LocalAuthority} [props.localAuthority] - Owning local library authority.
 * @param {'small' | 'medium' | 'large'} [props.size='small'] - Marker button size.
 * @param {boolean} [props.selected=false] - Whether this vehicle is currently selected in the tracker.
 * @param {(mobileId: number) => void} [props.onSelect] - Stable callback to open the mobile tracker.
 * @returns {JSX.Element} MobileAvatar element.
 */
const MobileAvatar = props => {
  const {
    mobileId,
    label,
    statusText = '',
    localAuthority,
    size = 'small',
    selected = false,
    onSelect
  } = props
  const theme = useTheme()

  const backgroundColor = useMemo(() => {
    return localAuthority
      ? localAuthority.getRgbaColour(0.9)
      : utilsHelper.hextoRGBA(theme.palette.primary.main, 0.9)
  }, [localAuthority, theme.palette.primary.main])

  const border = selected ? 4 : size === 'small' ? 2 : size === 'medium' ? 3 : 4
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
    <Tooltip title={`${ariaLabel} (click to track)`} describeChild>
      <Fab
        size={size}
        aria-label={ariaLabel}
        onClick={e => {
          e.stopPropagation()
          if (onSelect) onSelect(mobileId)
        }}
        style={{
          backgroundColor,
          borderWidth: border,
          borderColor: selected
            ? theme.palette.secondary.main
            : theme.palette.common.white,
          borderStyle: 'solid'
        }}
      >
        <DirectionBusIcon />
      </Fab>
    </Tooltip>
  )
}

export default React.memo(MobileAvatar)
