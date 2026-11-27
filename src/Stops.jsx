import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import CalendarTodayIcon from '@mui/icons-material/CalendarTodayRounded'
import CloseIcon from '@mui/icons-material/CloseRounded'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBusRounded'
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded'
import PrintIcon from '@mui/icons-material/PrintRounded'
import SaveIcon from '@mui/icons-material/SaveAltRounded'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import ExternalLink from './ExternalLink'
import ServiceFilter from './ServiceFilter'
import { formatTimeWindow } from './helpers/dates'
import * as stopModel from './models/stops'
import * as urlHelper from './helpers/url'
import { metersToMiles } from './helpers/utils'

const PAGE_SIZE = 6

/**
 * Clean expandable card representing a single mobile library stop.
 * Clicking the card selects & locates the stop on the map and toggles full stop details inline.
 *
 * @param {Object} props - Component props.
 * @param {import('./models/stops').Stop} props.stop - Stop model instance.
 * @param {boolean} props.selected - Whether this stop is the current map selection.
 * @param {boolean} props.expanded - Whether the full stop details are expanded.
 * @param {(stop: import('./models/stops').Stop) => void} props.onToggle - Handler when the stop card is clicked.
 * @param {(mobileId: number) => void} [props.onSelectMobile] - Handler to open the mobile tracker for a visiting vehicle.
 * @returns {JSX.Element} StopCard component.
 */
const StopCard = React.memo(({ stop, selected, expanded, onToggle, onSelectMobile }) => {
  const addressLine = [stop.address, stop.postcode].filter(Boolean).join(', ')
  const scheduleSummary = (stop.routeFrequencyDescriptions || [])
    .map((desc, idx) => {
      const day = stop.routeDays?.[idx] || stop.routeDays?.[0] || ''
      return [day, desc].filter(Boolean).join(', ')
    })
    .join(' • ')

  const timeWindow = formatTimeWindow(
    stop.arrivalTimes?.[0],
    stop.departureTimes?.[0]
  )

  return (
    <Card
      id={`stop-card-${stop.id}`}
      sx={selected ? { backgroundColor: 'background.subtle' } : undefined}
    >
      <CardActionArea
        onClick={() => onToggle(stop)}
        aria-expanded={expanded}
        sx={{ px: { xs: 1.25, sm: 2 }, py: { xs: 1, sm: 1.5 } }}
      >
        <Stack
          direction='row'
          spacing={1}
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Stack
              direction='row'
              spacing={0.75}
              sx={{
                alignItems: 'center',
                mb: { xs: 0, sm: 0.25 },
                flexWrap: 'wrap'
              }}
              useFlexGap
            >
              <Typography
                variant='caption'
                noWrap
                sx={{
                  color: 'primary.main',
                  fontWeight: 800,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {stop.localAuthorityName}
              </Typography>
              {stop.community && (
                <Typography
                  variant='caption'
                  noWrap
                  sx={{
                    color: 'text.primary',
                    fontWeight: 700,
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  • {stop.community}
                </Typography>
              )}
              {stop.distance != null && (
                <Chip
                  size='small'
                  color='secondary'
                  label={`${metersToMiles(stop.distance)} mi`}
                  sx={{
                    minHeight: 20,
                    height: 20,
                    fontSize: '0.72rem',
                    display: { xs: 'none', sm: 'flex' }
                  }}
                />
              )}
            </Stack>
            <Typography
              variant='h6'
              component='h3'
              noWrap
              sx={{
                lineHeight: 1.25,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {stop.name}
            </Typography>
            {stop.nextVisitFormatted && (
              <Stack
                direction='row'
                spacing={0.5}
                sx={{ alignItems: 'center', mt: 0.5 }}
              >
                <CalendarTodayIcon
                  sx={{ fontSize: '0.88rem', color: 'primary.main' }}
                />
                <Typography
                  variant='caption'
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  {stop.nextVisitFormatted}
                </Typography>
              </Stack>
            )}
          </Box>
          <Box sx={{ color: 'primary.main', display: 'flex' }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
        </Stack>
      </CardActionArea>

      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent
          sx={theme => ({
            p: { xs: 1.25, sm: 2 },
            borderTop: `2px solid ${theme.palette.background.default}`
          })}
        >
          <Stack spacing={{ xs: 1, sm: 1.25 }}>
            {(stop.localAuthorityName || stop.community || stop.distance != null) && (
              <Stack
                direction='row'
                spacing={0.75}
                useFlexGap
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <Typography variant='caption' sx={{ fontWeight: 700 }}>
                  {[stop.localAuthorityName, stop.community]
                    .filter(Boolean)
                    .join(' • ')}
                </Typography>
                {stop.distance != null && (
                  <Chip
                    size='small'
                    color='secondary'
                    label={`${metersToMiles(stop.distance)} mi away`}
                    sx={{ minHeight: 20, height: 20, fontSize: '0.72rem' }}
                  />
                )}
              </Stack>
            )}
            {addressLine && (
              <Box>
                <Typography
                  variant='caption'
                  sx={theme => theme.custom.fieldLabel}
                >
                  Address
                </Typography>
                <Typography
                  variant='body2'
                  sx={theme => theme.custom.fieldValue}
                >
                  {addressLine}
                </Typography>
              </Box>
            )}

            <Stack
              direction='row'
              spacing={2.5}
              sx={{ flexWrap: 'wrap' }}
              useFlexGap
            >
              {scheduleSummary && (
                <Box>
                  <Typography
                    variant='caption'
                    sx={theme => theme.custom.fieldLabel}
                  >
                    Frequency
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={theme => theme.custom.fieldValue}
                  >
                    {scheduleSummary}
                  </Typography>
                </Box>
              )}
              {timeWindow && (
                <Box>
                  <Typography
                    variant='caption'
                    sx={theme => theme.custom.fieldLabel}
                  >
                    Stop time
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={theme => theme.custom.fieldValue}
                  >
                    {timeWindow}
                  </Typography>
                </Box>
              )}
              {stop.type && (
                <Box>
                  <Typography
                    variant='caption'
                    sx={theme => theme.custom.fieldLabel}
                  >
                    Access
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={theme => theme.custom.fieldValue}
                  >
                    {stop.type}
                  </Typography>
                </Box>
              )}
            </Stack>

            {stop.mobileNames?.length > 0 && (
              <Box>
                <Typography
                  variant='caption'
                  sx={theme => ({ ...theme.custom.fieldLabel, mb: 0.5 })}
                >
                  Mobile library
                </Typography>
                <Stack
                  direction='row'
                  spacing={0.75}
                  sx={{ flexWrap: 'wrap' }}
                  useFlexGap
                >
                  {stop.mobileNames.map((mName, idx) => {
                    const mId = stop.mobileIds?.[idx]
                    return (
                      <Button
                        key={`stp_mob_${stop.id}_${idx}`}
                        size='small'
                        variant='outlined'
                        startIcon={<DirectionsBusIcon />}
                        onClick={
                          mId && onSelectMobile
                            ? () => onSelectMobile(mId)
                            : undefined
                        }
                      >
                        {mName}
                      </Button>
                    )
                  })}
                </Stack>
              </Box>
            )}

            <Stack
              direction='row'
              spacing={1.25}
              useFlexGap
              sx={{
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 0.5
              }}
            >
              <Stack
                direction='row'
                spacing={0.75}
                useFlexGap
                sx={{ flexWrap: 'wrap', alignItems: 'center' }}
              >
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<SaveIcon />}
                  onClick={() => urlHelper.openUrl(stop.icsUrl)}
                >
                  Calendar
                </Button>
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<PrintIcon />}
                  onClick={() => urlHelper.openUrl(stop.pdfUrl)}
                >
                  PDF
                </Button>
              </Stack>

              {stop.timetable && (
                <ExternalLink href={stop.timetable} sx={{ fontSize: '0.88rem' }}>
                  Timetable
                </ExternalLink>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  )
})

/**
 * Paginated list of expandable stop cards matching the current search and filter state.
 *
 * @returns {JSX.Element} Stops list component.
 */
const Stops = () => {
  const [
    {
      searchDistance,
      searchPosition,
      localAuthorityFilter,
      mobileFilter,
      routeFilter,
      currentStopId,
      currentStop
    },
    dispatchSearch
  ] = useSearchStateValue()
  const [{ stopDetailsExpanded }, dispatchView] = useViewStateValue()

  const [page, setPage] = useState(0)
  const [loadingMobileStops, setLoadingMobileStops] = useState(false)
  const [mobileStops, setMobileStops] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  // Synchronously reset page to 0 whenever filters or search coordinates change to avoid double-fetching
  const filterSignature = JSON.stringify([
    searchPosition,
    searchDistance,
    localAuthorityFilter,
    mobileFilter,
    routeFilter
  ])
  const prevFilterSigRef = useRef(filterSignature)
  const filterChanged = prevFilterSigRef.current !== filterSignature
  const effectivePage = filterChanged ? 0 : page

  useEffect(() => {
    let active = true
    if (filterChanged) {
      prevFilterSigRef.current = filterSignature
      if (page !== 0) setPage(0)
    }

    const sortField = searchPosition?.length > 0 ? 'distance' : 'name'
    setLoadingMobileStops(true)

    stopModel
      .getQueryStops(
        {
          page: effectivePage,
          pageSize: PAGE_SIZE,
          orderBy: { field: sortField, direction: 'asc' }
        },
        searchPosition,
        searchDistance,
        localAuthorityFilter,
        mobileFilter,
        routeFilter
      )
      .then(res => {
        if (!active) return
        setMobileStops(res.stops)
        setTotalCount(res.totalRowCount || 0)
        setLoadingMobileStops(false)

        // When a filter is newly selected, pan the map to the first matching stop
        if (
          filterChanged &&
          res.stops.length > 0 &&
          (localAuthorityFilter.length > 0 ||
            mobileFilter.length > 0 ||
            routeFilter.length > 0)
        ) {
          const first = res.stops[0]
          if (first.longitude != null && first.latitude != null) {
            dispatchView({
              type: 'FlyTo',
              mapFlyToPosition: [first.longitude, first.latitude],
              mapZoom:
                routeFilter.length > 0 || mobileFilter.length > 0 ? 13 : 10
            })
          }
        }
      })

    return () => {
      active = false
    }
  }, [
    effectivePage,
    filterSignature,
    searchPosition,
    searchDistance,
    localAuthorityFilter,
    mobileFilter,
    routeFilter,
    dispatchView
  ])

  const handleToggleStop = useCallback(
    stop => {
      const isSameStop = currentStopId === stop.id
      const nextExpanded = isSameStop ? !stopDetailsExpanded : true

      dispatchSearch({
        type: 'SetCurrentStop',
        currentStop: stop
      })
      dispatchView({
        type: 'SetStopExpanded',
        stopDetailsExpanded: nextExpanded
      })
      if (stop.longitude != null && stop.latitude != null) {
        dispatchView({
          type: 'FlyTo',
          mapFlyToPosition: [stop.longitude, stop.latitude],
          mapZoom: 15
        })
      }
    },
    [currentStopId, stopDetailsExpanded, dispatchSearch, dispatchView]
  )

  const handleSelectMobile = useCallback(
    mobileId => {
      dispatchSearch({
        type: 'SetCurrentMobileLibrary',
        mobileLibraryId: mobileId
      })
      dispatchView({
        type: 'SetMobileLibraryDialog',
        mobileLibraryDialogOpen: true
      })
    },
    [dispatchSearch, dispatchView]
  )

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  // Pin a stop selected from the map to the top of the list if it's not on the current page
  const displayedStops = useMemo(() => {
    if (!currentStop || mobileStops.some(s => s.id === currentStop.id)) {
      return mobileStops
    }
    return [currentStop, ...mobileStops]
  }, [currentStop, mobileStops])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden'
      }}
    >
      <Stack
        direction='row'
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
          px: 0.5
        }}
      >
        <Typography variant='subtitle2'>
          Stops {totalCount > 0 ? `(${totalCount.toLocaleString()})` : ''}
        </Typography>
        <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }}>
          {loadingMobileStops && (
            <CircularProgress size={16} aria-label='Loading stops' />
          )}
          {currentStop && (
            <IconButton
              size='small'
              aria-label={`Clear selected stop ${currentStop.name}`}
              onClick={() => {
                dispatchSearch({
                  type: 'SetCurrentStop',
                  currentStopId: null
                })
                dispatchView({
                  type: 'SetStopExpanded',
                  stopDetailsExpanded: false
                })
              }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          )}
        </Stack>
      </Stack>

      <Box sx={{ px: 0.25, mb: 1, flexShrink: 0 }}>
        <ServiceFilter />
      </Box>

      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', px: 0.25 }}>
        {displayedStops.length > 0
          ? (
            <Stack spacing={1}>
              {displayedStops.map(stop => (
                <StopCard
                  key={`stop_${stop.id}`}
                  stop={stop}
                  selected={currentStopId === stop.id}
                  expanded={
                    currentStopId === stop.id && Boolean(stopDetailsExpanded)
                  }
                  onToggle={handleToggleStop}
                  onSelectMobile={handleSelectMobile}
                />
              ))}
            </Stack>
            )
          : !loadingMobileStops
              ? (
                <Card sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant='body2'>
                    No mobile library stops match your current search.
                  </Typography>
                </Card>
                )
              : null}
      </Box>

      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexShrink: 0,
            mt: 1,
            pb: 0.5
          }}
        >
          <Pagination
            count={totalPages}
            page={effectivePage + 1}
            onChange={(_, value) => setPage(value - 1)}
            color='primary'
            size='small'
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      )}
    </Box>
  )
}

export default Stops
