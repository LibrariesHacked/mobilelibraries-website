import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import Map, {
  Source,
  Layer,
  Marker,
  NavigationControl
} from 'react-map-gl/maplibre'

import DirectionsBusIcon from '@mui/icons-material/DirectionsBusRounded'
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded'
import LayersIcon from '@mui/icons-material/LayersRounded'
import PlaceIcon from '@mui/icons-material/PlaceRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import MeAvatar from './MeAvatar'
import MobileAvatar from './MobileAvatar'
import MobileTracker from './MobileTracker'
import MapSettings from './MapSettings'

import * as stopModel from './models/stops'
import config from './helpers/config.json'
import theme from './theme'

setWorkerUrl(workerUrl)

const MAP_STYLE =
  'https://api.maptiler.com/maps/dataviz/style.json?key=1OK05AJqNta7xYzrG2kA'
const LIBRARY_AUTHORITY_TILES = [config.libraryAuthorityTiles]
const MOBILE_TILES = [config.mobileTiles]
const INTERACTIVE_LAYER_IDS = ['stops-circle', 'trips-line']
const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' }

/** Client-side interpolation step interval (2s) along a vehicle's 60-second `routeSection`. */
const INTERPOLATION_TICK_MS = 2000

const ACTIVE_SECTION_PAINT = {
  'line-opacity': 0.9,
  'line-width': 4,
  'line-color': theme.palette.secondary.dark
}

const LINE_LAYOUT = { 'line-join': 'round', 'line-cap': 'square' }

const AUTHORITY_LINE_PAINT = {
  'line-color': theme.palette.primary.light,
  'line-opacity': 1,
  'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 18, 4]
}

const AUTHORITY_FILL_PAINT = {
  'fill-color': theme.palette.primary.light,
  'fill-opacity': 0.1
}

const TRIPS_LINE_PAINT = {
  'line-color': theme.palette.warmNeutral.main,
  'line-offset': ['interpolate', ['linear'], ['zoom'], 14, 1, 18, 4],
  'line-opacity': 0.85,
  'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 18, 4],
  'line-dasharray': [2, 0.5]
}

const STOPS_CIRCLE_PAINT = {
  'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 2.5, 18, 8],
  'circle-color': theme.palette.tertiary.main,
  'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 5, 1, 18, 3],
  'circle-stroke-color': theme.palette.common.white,
  'circle-opacity': 0.8
}

const STOPS_NAME_LAYOUT = {
  'text-ignore-placement': false,
  'text-field': ['get', 'name'],
  'text-font': ['Source Sans Pro Bold'],
  'text-line-height': 1,
  'text-size': ['interpolate', ['linear'], ['zoom'], 13, 12, 18, 18],
  'text-offset': [
    'interpolate',
    ['linear'],
    ['zoom'],
    13,
    ['literal', [0, 1.5]],
    18,
    ['literal', [0, 2]]
  ]
}

const STOPS_TEXT_PAINT = {
  'text-halo-color': theme.palette.common.white,
  'text-halo-width': 1,
  'text-halo-blur': 1,
  'text-color': theme.palette.text.secondary
}

const STOPS_NEXT_VISITING_LAYOUT = {
  'text-ignore-placement': false,
  'text-field': ['to-string', ['get', 'next_visiting']],
  'text-font': ['Source Sans Pro Bold'],
  'text-line-height': 1,
  'text-size': ['interpolate', ['linear'], ['zoom'], 14, 10, 18, 16],
  'text-offset': [
    'interpolate',
    ['linear'],
    ['zoom'],
    13,
    ['literal', [0, -1.5]],
    18,
    ['literal', [0, -2]]
  ]
}

/**
 * Determines the marker icon size tier for a given map zoom level.
 *
 * @param {number} zoom - Current map zoom level.
 * @returns {'small' | 'medium' | 'large'} Marker size.
 */
const getMarkerSizeForZoom = zoom =>
  zoom < 8 ? 'small' : zoom < 12 ? 'medium' : 'large'

/**
 * Interactive MapLibre GL map displaying live mobile library positions,
 * stops, trips, the embedded stop list, and the interactive MobileTracker.
 *
 * @returns {JSX.Element} MobileMap component.
 */
const MobileMap = () => {
  const [
    {
      mobileLocations,
      mobileLocationLookup,
      mobileLookup,
      localAuthorityLookup,
      routes
    }
  ] = useApplicationStateValue()
  const [
    {
      searchType,
      searchPosition,
      currentStopId,
      currentStop,
      currentMobileLibraryId,
      localAuthorityFilter,
      mobileFilter
    },
    dispatchSearch
  ] = useSearchStateValue()
  const [
    {
      mapZoom,
      mapPosition,
      mapSettings,
      mapSettingsDialogOpen,
      mapFlyToPosition,
      mobileLibraryDialogOpen
    },
    dispatchView
  ] = useViewStateValue()

  const [map, setMap] = useState(null)
  const [cursor, setCursor] = useState('grab')
  const [activeMobilesMenuAnchor, setActiveMobilesMenuAnchor] = useState(null)
  const [markerSize, setMarkerSize] = useState(() =>
    getMarkerSizeForZoom(mapZoom[0])
  )
  const [interpolationTick, setInterpolationTick] = useState(0)
  const [fallbackCoordsByMobileId, setFallbackCoordsByMobileId] = useState({})
  const fallbackCacheRef = useRef({})
  const requestedFallbackIdsRef = useRef(new Set())

  const initialViewState = useMemo(
    () => ({
      longitude: mapPosition[0],
      latitude: mapPosition[1],
      zoom: mapZoom[0]
    }),
    [] // eslint-disable-line
  )

  useEffect(() => {
    if (mapFlyToPosition && map) {
      map.flyTo({
        center: mapFlyToPosition,
        zoom: mapZoom?.[0] || 14
      })
    }
  }, [mapFlyToPosition, mapZoom, map])

  // Only fetch stop details from API if selected by ID on the map (when currentStop isn't already populated)
  useEffect(() => {
    let active = true
    if (!currentStopId || (currentStop && currentStop.id === currentStopId)) {
      return
    }
    stopModel.getStopById(currentStopId).then(stopData => {
      if (active && stopData && stopData.id) {
        dispatchSearch({ type: 'SetCurrentStop', currentStop: stopData })
      }
    })
    return () => {
      active = false
    }
  }, [currentStopId, currentStop, dispatchSearch])

  const cacheFallbackCoords = useCallback((mobileId, coords) => {
    fallbackCacheRef.current[mobileId] = coords
    setFallbackCoordsByMobileId(prev =>
      prev[mobileId] ? prev : { ...prev, [mobileId]: coords }
    )
  }, [])

  // Resolve coordinates for a mobile library (live coordinates -> current/next/previous stop -> first stop of mobile)
  const resolveMobileCoordinates = useCallback(
    async mobileId => {
      if (!mobileId) return null
      const loc = mobileLocationLookup?.[mobileId]
      const liveCoords = loc?.getCoordinates()
      if (liveCoords) return liveCoords

      if (fallbackCacheRef.current[mobileId]) {
        return fallbackCacheRef.current[mobileId]
      }

      const stopId =
        loc?.currentStopId || loc?.nextStopId || loc?.previousStopId
      if (stopId) {
        const stop = await stopModel.getStopById(stopId)
        if (stop && stop.longitude != null && stop.latitude != null) {
          const coords = [stop.longitude, stop.latitude]
          cacheFallbackCoords(mobileId, coords)
          return coords
        }
      }

      const res = await stopModel.getQueryStops(
        { page: 0, pageSize: 1 },
        [],
        '',
        [],
        [mobileId],
        []
      )
      const firstStop = res.stops?.[0]
      if (
        firstStop &&
        firstStop.longitude != null &&
        firstStop.latitude != null
      ) {
        const coords = [firstStop.longitude, firstStop.latitude]
        cacheFallbackCoords(mobileId, coords)
        return coords
      }
      return null
    },
    [mobileLocationLookup, cacheFallbackCoords]
  )

  // Whenever a mobile library is selected in the tracker (from map, stop card, or filter), fly to its location once
  useEffect(() => {
    let active = true
    if (!mobileLibraryDialogOpen || !currentMobileLibraryId) return

    resolveMobileCoordinates(currentMobileLibraryId).then(coords => {
      if (active && coords) {
        dispatchView({
          type: 'FlyTo',
          mapFlyToPosition: coords,
          mapZoom: 12
        })
      }
    })
    return () => {
      active = false
    }
  }, [
    mobileLibraryDialogOpen,
    currentMobileLibraryId,
    resolveMobileCoordinates,
    dispatchView
  ])

  // Pre-populate fallback stop coordinates once per active vehicle whose location row has null geox/geoy
  useEffect(() => {
    if (!mobileLocations || mobileLocations.length === 0) return

    for (const loc of mobileLocations) {
      if (
        loc.geoX == null &&
        loc.isActive() &&
        !requestedFallbackIdsRef.current.has(loc.mobileId)
      ) {
        const stopId =
          loc.currentStopId || loc.nextStopId || loc.previousStopId
        if (stopId) {
          requestedFallbackIdsRef.current.add(loc.mobileId)
          stopModel.getStopById(stopId).then(stop => {
            if (stop && stop.longitude != null && stop.latitude != null) {
              cacheFallbackCoords(loc.mobileId, [stop.longitude, stop.latitude])
            }
          })
        }
      }
    }
  }, [mobileLocations, cacheFallbackCoords])

  // Precompute static vehicle metadata & status once per API location poll
  const vehicleStatuses = useMemo(() => {
    if (!mobileLocations || mobileLocations.length === 0) return []
    const now = new Date()
    return mobileLocations
      .map(loc => {
        const mobile = mobileLookup[loc.mobileId]
        if (!mobile) return null
        const localAuthority = localAuthorityLookup[mobile.localAuthorityId]
        const status = loc.getStatus(now)
        const isActive = loc.isActive(status)
        return {
          loc,
          mobile,
          localAuthority,
          label: mobile.getDisplayTitle(localAuthority),
          status,
          statusText: status?.textFormat || '',
          isActive
        }
      })
      .filter(Boolean)
  }, [mobileLocations, mobileLookup, localAuthorityLookup])

  // Run a lightweight client-side interpolation timer ONLY when at least one vehicle has an active routeSection
  const hasMovingVehicles = useMemo(
    () => vehicleStatuses.some(({ loc }) => loc.isMoving),
    [vehicleStatuses]
  )

  useEffect(() => {
    if (!hasMovingVehicles) return
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        setInterpolationTick(t => t + 1)
      }
    }, INTERPOLATION_TICK_MS)
    return () => clearInterval(intervalId)
  }, [hasMovingVehicles])

  const handleZoom = useCallback(evt => {
    const nextSize = getMarkerSizeForZoom(evt.viewState.zoom)
    setMarkerSize(prev => (prev === nextSize ? prev : nextSize))
  }, [])

  const openMobileTracker = useCallback(
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

  const selectStopById = useCallback(
    stopId => {
      dispatchSearch({
        type: 'SetCurrentStop',
        currentStopId: stopId
      })
      dispatchView({
        type: 'SetStopExpanded',
        stopDetailsExpanded: false
      })
    },
    [dispatchSearch, dispatchView]
  )

  const handleFilterMobile = useCallback(
    (localAuthorityId, mobileId, routeId) => {
      dispatchSearch({
        type: 'FilterByMobile',
        localAuthorityId,
        mobileId
      })
      if (routeId) {
        dispatchSearch({
          type: 'FilterByRoute',
          routeId
        })
      }
    },
    [dispatchSearch]
  )

  const clickMap = useCallback(
    event => {
      const features = event.features
      if (!features || features.length === 0) return
      for (const feature of features) {
        if (feature.sourceLayer === 'stops' || feature.sourceLayer === 'stop') {
          selectStopById(feature.properties.id)
          break
        }
        if (feature.sourceLayer === 'trips' || feature.sourceLayer === 'trip') {
          dispatchSearch({
            type: 'SetCurrentTrip',
            currentTripId: feature.properties.id
          })
          dispatchView({
            type: 'SetTripDialog',
            tripDialogOpen: true
          })
          break
        }
      }
    },
    [selectStopById, dispatchSearch, dispatchView]
  )

  const handleMouseEnter = useCallback(() => setCursor('pointer'), [])
  const handleMouseLeave = useCallback(() => setCursor('grab'), [])

  const activeVehicles = useMemo(() => {
    return vehicleStatuses.filter(({ mobile, isActive }) => {
      if (!isActive) return false
      if (
        localAuthorityFilter.length > 0 &&
        !localAuthorityFilter.includes(mobile.localAuthorityId)
      ) {
        return false
      }
      return mobileFilter.length === 0 || mobileFilter.includes(mobile.id)
    })
  }, [vehicleStatuses, localAuthorityFilter, mobileFilter])

  const trackedMobile =
    mobileLibraryDialogOpen && currentMobileLibraryId != null
      ? mobileLookup[currentMobileLibraryId]
      : null
  const trackedAuthority = trackedMobile
    ? localAuthorityLookup[trackedMobile.localAuthorityId]
    : null
  const trackedLocation = trackedMobile
    ? mobileLocationLookup[trackedMobile.id]
    : null
  const trackedRoutes = useMemo(() => {
    if (!trackedMobile || !routes) return []
    return routes.filter(r => r.mobileId === trackedMobile.id)
  }, [trackedMobile, routes])

  const markers = useMemo(() => {
    const now = new Date()
    const renderedIds = new Set()
    const list = vehicleStatuses
      .map(({ loc, localAuthority, label, statusText, isActive }) => {
        if (!isActive) return null
        const coordinates =
          loc.getCoordinates(now) || fallbackCoordsByMobileId[loc.mobileId]
        if (!coordinates) return null
        renderedIds.add(loc.mobileId)
        return (
          <Marker
            key={'mkr_' + loc.mobileId}
            longitude={coordinates[0]}
            latitude={coordinates[1]}
            anchor='bottom'
          >
            <MobileAvatar
              mobileId={loc.mobileId}
              localAuthority={localAuthority}
              label={label}
              statusText={statusText}
              size={markerSize}
              selected={
                mobileLibraryDialogOpen &&
                currentMobileLibraryId === loc.mobileId
              }
              onSelect={openMobileTracker}
            />
          </Marker>
        )
      })
      .filter(Boolean)

    const trackedCoordinates =
      trackedLocation?.getCoordinates(now) ||
      fallbackCoordsByMobileId[trackedMobile?.id]

    if (
      trackedMobile &&
      !renderedIds.has(trackedMobile.id) &&
      trackedCoordinates
    ) {
      const trackedStatus = trackedLocation?.getStatus(now)
      list.push(
        <Marker
          key={'mkr_' + trackedMobile.id}
          longitude={trackedCoordinates[0]}
          latitude={trackedCoordinates[1]}
          anchor='bottom'
        >
          <MobileAvatar
            mobileId={trackedMobile.id}
            localAuthority={trackedAuthority}
            label={trackedMobile.getDisplayTitle(trackedAuthority)}
            statusText={trackedStatus?.textFormat || 'Not out today'}
            size={markerSize}
            selected
            onSelect={openMobileTracker}
          />
        </Marker>
      )
    }
    return list
  }, [
    vehicleStatuses,
    fallbackCoordsByMobileId,
    interpolationTick,
    markerSize,
    mobileLibraryDialogOpen,
    currentMobileLibraryId,
    trackedMobile,
    trackedAuthority,
    trackedLocation,
    openMobileTracker
  ])

  const activeRouteGeoJson = useMemo(() => {
    if (!trackedLocation?.routeSection) return null
    return {
      type: 'Feature',
      geometry: trackedLocation.routeSection
    }
  }, [trackedLocation])

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 0,
        borderRadius: 0,
        overflow: 'hidden'
      }}
    >
      {/* Full-width map app bar with the active mobile and map layer controls */}
      <AppBar
        component='header'
        position='absolute'
        elevation={0}
        sx={theme => ({
          zIndex: 5,
          ...theme.custom.mapTopBar,
          color: theme.palette.text.primary
        })}
      >
        <Toolbar
          variant='dense'
          sx={{
            minHeight: { xs: 48, sm: 56 },
            px: 1.5,
            gap: 1,
            justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0
            }}
          >
            <Button
              id='on-the-road-button'
              aria-controls={
                activeMobilesMenuAnchor ? 'on-the-road-menu' : undefined
              }
              aria-expanded={Boolean(activeMobilesMenuAnchor)}
              aria-haspopup='menu'
              size='small'
              variant={activeVehicles.length > 0 ? 'contained' : 'outlined'}
              color='primary'
              startIcon={<DirectionsBusIcon />}
              endIcon={
                activeVehicles.length > 0 ? <ExpandMoreIcon /> : undefined
              }
              onClick={e => {
                if (activeVehicles.length > 0) {
                  setActiveMobilesMenuAnchor(e.currentTarget)
                }
              }}
              sx={{ flexShrink: 0 }}
            >
              On the road ({activeVehicles.length})
            </Button>

            {trackedMobile && (
              <Chip
                size='small'
                color='secondary'
                label={trackedMobile.getDisplayTitle(trackedAuthority, ': ')}
                onClick={() => openMobileTracker(trackedMobile.id)}
                onDelete={() =>
                  dispatchView({
                    type: 'SetMobileLibraryDialog',
                    mobileLibraryDialogOpen: false
                  })}
              />
            )}
          </Box>

          <Tooltip title='Map layers & settings' describeChild>
            <Button
              size='small'
              variant='outlined'
              startIcon={<LayersIcon />}
              onClick={() =>
                dispatchView({
                  type: 'SetMapSettingsDialog',
                  mapSettingsDialogOpen: true
                })}
              sx={{ flexShrink: 0 }}
            >
              Layers
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Menu
        id='on-the-road-menu'
        aria-labelledby='on-the-road-button'
        anchorEl={activeMobilesMenuAnchor}
        open={Boolean(activeMobilesMenuAnchor)}
        onClose={() => setActiveMobilesMenuAnchor(null)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: { maxHeight: 360, minWidth: 260, maxWidth: 340 }
          }
        }}
      >
        {activeVehicles.map(({ mobile, localAuthority, statusText }) => (
          <MenuItem
            key={`act_mob_${mobile.id}`}
            selected={
              mobileLibraryDialogOpen && currentMobileLibraryId === mobile.id
            }
            onClick={() => {
              setActiveMobilesMenuAnchor(null)
              openMobileTracker(mobile.id)
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              py: 0.75
            }}
          >
            <Typography
              variant='body2'
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              {mobile.getDisplayTitle(localAuthority, ': ')}
            </Typography>
            {statusText && (
              <Typography
                variant='caption'
                sx={{ color: 'primary.main', fontSize: '0.75rem' }}
              >
                {statusText}
              </Typography>
            )}
          </MenuItem>
        ))}
      </Menu>

      {/* Interactive Mobile Tracker overlay when a mobile library is clicked */}
      {trackedMobile && (
        <MobileTracker
          mobile={trackedMobile}
          localAuthority={trackedAuthority}
          location={trackedLocation}
          routes={trackedRoutes}
          onSelectStop={stopId => {
            stopModel.getStopById(stopId).then(s => {
              if (s && s.id) {
                dispatchSearch({ type: 'SetCurrentStop', currentStop: s })
                dispatchView({
                  type: 'SetStopExpanded',
                  stopDetailsExpanded: false
                })
                if (s.longitude != null && s.latitude != null) {
                  dispatchView({
                    type: 'FlyTo',
                    mapFlyToPosition: [s.longitude, s.latitude],
                    mapZoom: 15
                  })
                }
              }
            })
          }}
          onFilterMobile={handleFilterMobile}
          onClose={() =>
            dispatchView({
              type: 'SetMobileLibraryDialog',
              mobileLibraryDialogOpen: false
            })}
        />
      )}

      <Map
        ref={setMap}
        style={MAP_CONTAINER_STYLE}
        mapStyle={MAP_STYLE}
        initialViewState={initialViewState}
        maxZoom={18}
        cursor={cursor}
        interactiveLayerIds={INTERACTIVE_LAYER_IDS}
        onZoom={handleZoom}
        onClick={clickMap}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {markers}

        {currentStop &&
          currentStop.longitude != null &&
          currentStop.latitude != null && (
            <Marker
              longitude={currentStop.longitude}
              latitude={currentStop.latitude}
              anchor='bottom'
            >
              <Tooltip title={currentStop.name}>
                <PlaceIcon
                  sx={{
                    fontSize: 38,
                    color: 'tertiary.main',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))'
                  }}
                />
              </Tooltip>
            </Marker>
        )}

        {activeRouteGeoJson && (
          <Source
            id='active-route-section'
            type='geojson'
            data={activeRouteGeoJson}
          >
            <Layer
              id='active-route-section-line'
              type='line'
              paint={ACTIVE_SECTION_PAINT}
            />
          </Source>
        )}

        {mapSettings.authorityBoundary && (
          <Source
            id='authority-tiles'
            type='vector'
            tiles={LIBRARY_AUTHORITY_TILES}
          >
            <Layer
              id='authority-boundary-line'
              type='line'
              source-layer='library_authority_boundaries'
              minzoom={6}
              layout={LINE_LAYOUT}
              paint={AUTHORITY_LINE_PAINT}
            />
            <Layer
              id='authority-boundary-fill'
              type='fill'
              source-layer='library_authority_boundaries'
              minzoom={6}
              paint={AUTHORITY_FILL_PAINT}
            />
          </Source>
        )}

        <Source
          id='mobile-tiles'
          type='vector'
          tiles={MOBILE_TILES}
          maxzoom={14}
        >
          <Layer
            id='trips-line'
            type='line'
            source-layer='trips'
            minzoom={14}
            layout={LINE_LAYOUT}
            paint={TRIPS_LINE_PAINT}
          />
          <Layer
            id='stops-circle'
            type='circle'
            source-layer='stops'
            minzoom={5}
            paint={STOPS_CIRCLE_PAINT}
          />
          <Layer
            id='stops-name'
            type='symbol'
            source-layer='stops'
            minzoom={13}
            layout={STOPS_NAME_LAYOUT}
            paint={STOPS_TEXT_PAINT}
          />
          <Layer
            id='stops-next-visiting'
            type='symbol'
            source-layer='stops'
            minzoom={14}
            layout={STOPS_NEXT_VISITING_LAYOUT}
            paint={STOPS_TEXT_PAINT}
          />
        </Source>

        {searchPosition && searchPosition.length > 1 && (
          <Marker longitude={searchPosition[0]} latitude={searchPosition[1]}>
            <MeAvatar searchType={searchType} />
          </Marker>
        )}
        {/* Bottom-right zoom control completely clear of the full-width top bar and left-side overlays */}
        <NavigationControl position='bottom-right' showCompass={false} />
      </Map>

      <MapSettings
        mapSettings={mapSettings}
        mapSettingsDialogOpen={mapSettingsDialogOpen}
      />
    </Box>
  )
}

export default MobileMap
