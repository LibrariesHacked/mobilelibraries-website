import React from 'react'

import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/CloseRounded'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBusRounded'
import FilterListIcon from '@mui/icons-material/FilterListRounded'
import PlaceIcon from '@mui/icons-material/PlaceRounded'
import WebIcon from '@mui/icons-material/LanguageRounded'

import * as urlHelper from './helpers/url'

/**
 * Clean mobile library tracker overlay displayed on the map when a vehicle is selected.
 * Shows live stop progress (previous, current, and next stop), route schedules, and quick filters.
 *
 * @param {Object} props - Component props.
 * @param {import('./models/mobiles').Mobile} props.mobile - Selected mobile library vehicle.
 * @param {import('./models/localAuthorities').LocalAuthority} [props.localAuthority] - Operating local authority.
 * @param {import('./models/mobiles').MobileLocation} [props.location] - Live/estimated vehicle location and stop status.
 * @param {import('./models/routes').Route[]} [props.routes=[]] - Routes served by this vehicle.
 * @param {(stopId: number) => void} props.onSelectStop - Callback when a stop in the tracker is clicked.
 * @param {(localAuthorityId: number, mobileId: number, routeId?: number) => void} props.onFilterMobile - Callback to filter stops by this mobile or route.
 * @param {() => void} props.onClose - Callback to close the tracker panel.
 * @returns {JSX.Element|null} MobileTracker component.
 */
const MobileTracker = ({
  mobile,
  localAuthority,
  location,
  routes = [],
  onSelectStop,
  onFilterMobile,
  onClose
}) => {
  if (!mobile) return null

  const status = location ? location.getStatus() : null
  const isActive = location ? location.isActive(status) : false
  const displayTitle = mobile.getDisplayTitle(localAuthority, ' — ')
  const websiteUrl =
    mobile.timetable ||
    (localAuthority && (localAuthority.timetable || localAuthority.website)) ||
    null

  const renderStopRow = (label, stopId, stopName, timeLabel) => {
    if (!stopId || !stopName) return null
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          py: 0.5
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant='caption' sx={{ display: 'block', lineHeight: 1.2 }}>
            {label}
          </Typography>
          <Button
            size='small'
            variant='text'
            startIcon={<PlaceIcon fontSize='small' />}
            onClick={() => onSelectStop(stopId)}
            sx={{
              p: 0,
              minWidth: 0,
              textAlign: 'left',
              justifyContent: 'flex-start'
            }}
          >
            <Typography variant='body2' noWrap sx={{ fontWeight: 700, color: 'inherit' }}>
              {stopName}
            </Typography>
          </Button>
        </Box>
        {timeLabel && (
          <Typography variant='caption' sx={{ flexShrink: 0 }}>
            {timeLabel}
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <Paper
      elevation={0}
      aria-label={`Mobile tracker for ${displayTitle}`}
      sx={theme => ({
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: { xs: 16, sm: 'auto' },
        width: { sm: 360, md: 380 },
        maxHeight: 'calc(100% - 96px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 8px 24px ${alpha(theme.palette.text.primary, 0.16)}`
      })}
    >
      <Box
        sx={theme => ({
          px: 2,
          py: 1.25,
          backgroundColor: theme.palette.warmNeutral.cream,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1
        })}
      >
        <Stack direction='row' spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
          <DirectionsBusIcon color='primary' fontSize='small' />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant='caption'
              noWrap
              sx={{ color: 'primary.main', display: 'block', lineHeight: 1.2 }}
            >
              {localAuthority ? localAuthority.name : 'Mobile Library'}
            </Typography>
            <Typography
              variant='h6'
              noWrap
              sx={{ fontSize: '1rem', lineHeight: 1.25 }}
            >
              {mobile.name}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          size='small'
          aria-label='Close mobile tracker'
          onClick={onClose}
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, overflowY: 'auto' }}>
        <Stack direction='row' spacing={1} sx={{ mb: 1.25, alignItems: 'center', flexWrap: 'wrap' }} useFlexGap>
          <Chip
            size='small'
            color={isActive ? 'primary' : 'secondary'}
            label={status ? status.textFormat : 'Schedule information'}
          />
          <Typography variant='caption'>
            {mobile.routeCountDescription} • {mobile.stopCountDescription}
          </Typography>
        </Stack>

        {location && (location.previousStopId || location.currentStopId || location.nextStopId) && (
          <Stack spacing={0.5} sx={{ mb: 1.5 }}>
            {renderStopRow(
              'Previous stop',
              location.previousStopId,
              location.previousStopName,
              location.previousStopDeparture ? location.previousStopDeparture.fromNow() : ''
            )}
            {renderStopRow(
              'Current stop',
              location.currentStopId,
              location.currentStopName,
              location.currentStopDeparture
                ? `${location.currentStopDeparture.fromNow(true)} left`
                : ''
            )}
            {renderStopRow(
              'Next stop',
              location.nextStopId,
              location.nextStopName,
              location.nextStopArrival ? location.nextStopArrival.fromNow() : ''
            )}
          </Stack>
        )}

        {routes.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant='caption' sx={{ display: 'block', mb: 0.5 }}>
              Routes ({routes.length})
            </Typography>
            <Stack
              spacing={0.25}
              sx={{ maxHeight: 130, overflowY: 'auto', pr: 0.5 }}
            >
              {routes.map(route => (
                <Box
                  key={`trk_rt_${route.id}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    py: 0.25
                  }}
                >
                  <Button
                    size='small'
                    variant='text'
                    onClick={() =>
                      onFilterMobile(mobile.localAuthorityId, mobile.id, route.id)}
                    sx={{ p: 0, minWidth: 0, textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    <Typography variant='body2' noWrap sx={{ fontWeight: 600, color: 'inherit' }}>
                      {route.name}
                    </Typography>
                  </Button>
                  <Typography variant='caption' sx={{ flexShrink: 0 }}>
                    {route.numberStops} stops
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Stack
          direction='row'
          spacing={1}
          sx={{ mt: 2, justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Button
            size='small'
            variant='contained'
            color='primary'
            startIcon={<FilterListIcon />}
            onClick={() => onFilterMobile(mobile.localAuthorityId, mobile.id)}
          >
            Show vehicle stops
          </Button>
          {websiteUrl && (
            <Button
              size='small'
              variant='outlined'
              startIcon={<WebIcon />}
              onClick={() => urlHelper.openUrl(websiteUrl)}
            >
              Timetable
            </Button>
          )}
        </Stack>
      </Box>
    </Paper>
  )
}

export default React.memo(MobileTracker)
