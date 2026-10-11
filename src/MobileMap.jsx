import React, { useCallback, useEffect, useMemo, useState } from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'

import { setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import Map, {
  Source,
  Layer,
  Marker,
  NavigationControl
} from 'react-map-gl/maplibre'

import LayersIcon from '@mui/icons-material/LayersRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import MeAvatar from './MeAvatar'
import MobileAvatar from './MobileAvatar'
import MapSettings from './MapSettings'
import PostcodeSearch from './PostcodeSearch'

import config from './helpers/config.json'
import theme from './theme'

dayjs.extend(relativeTime)
setWorkerUrl(workerUrl)

const MAP_STYLE =
  'https://api.maptiler.com/maps/dataviz/style.json?key=1OK05AJqNta7xYzrG2kA'
const LIBRARY_AUTHORITY_TILES = [config.libraryAuthorityTiles]
const MOBILE_TILES = [config.mobileTiles]
const INTERACTIVE_LAYER_IDS = ['stops-circle', 'trips-line']

const MAP_CONTAINER_STYLE = {
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  top: 0,
  left: 0
}

const SERVICE_GEOJSON_PAINT = {
  'line-opacity': 0.4,
  'line-width': 2,
  'line-color': theme.palette.secondary.main
}

const AUTHORITY_LINE_LAYOUT = {
  'line-join': 'round',
  'line-cap': 'square'
}

const AUTHORITY_LINE_PAINT = {
  'line-color': theme.palette.secondary.light,
  'line-opacity': 1,
  'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 18, 4]
}

const AUTHORITY_FILL_PAINT = {
  'fill-color': theme.palette.secondary.light,
  'fill-opacity': 0.1
}

const TRIPS_LINE_LAYOUT = {
  'line-join': 'round',
  'line-cap': 'square'
}

const TRIPS_LINE_PAINT = {
  'line-color': theme.palette.secondary.light,
  'line-offset': ['interpolate', ['linear'], ['zoom'], 14, 1, 18, 4],
  'line-opacity': 1,
  'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 18, 4],
  'line-dasharray': [2, 0.5]
}

const STOPS_CIRCLE_PAINT = {
  'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 2, 18, 8],
  'circle-color': theme.palette.secondary.main,
  'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 5, 1, 18, 3],
  'circle-stroke-color': theme.palette.common.white,
  'circle-opacity': 0.5
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
 * @param {number} zoom - Current map zoom level.
 * @returns {'small' | 'medium' | 'large'} Marker size.
 */
const getMarkerSizeForZoom = zoom =>
  zoom < 8 ? 'small' : zoom < 12 ? 'medium' : 'large'

/**
 * Interactive full-screen MapLibre GL map displaying live mobile library positions,
 * stops, trips, and library authority boundaries.
 * @returns {JSX.Element} MobileMap component.
 */
const MobileMap = () => {
  const [{ mobileLocations, mobileLookup, organisationLookup }] =
    useApplicationStateValue() //eslint-disable-line
  const [{ searchType, searchPosition, currentService }, dispatchSearch] =
    useSearchStateValue() //eslint-disable-line
  const [
    {
      mapZoom,
      mapPosition,
      mapSettings,
      mapSettingsDialogOpen,
      mapFlyToPosition,
      mapBounds
    },
    dispatchView
  ] = useViewStateValue() //eslint-disable-line

  const [map, setMap] = useState(null)
  const [cursor, setCursor] = useState('grab')
  const [markerSize, setMarkerSize] = useState(() =>
    getMarkerSizeForZoom(mapZoom[0])
  )

  const initialViewState = useMemo(
    () => ({
      longitude: mapPosition[0],
      latitude: mapPosition[1],
      zoom: mapZoom[0]
    }),
    [] // eslint-disable-line
  )

  useEffect(() => {
    if (mapBounds && map) {
      map.fitBounds(mapBounds, {
        padding: 50
      })
    }
  }, [mapBounds, map])

  useEffect(() => {
    if (mapFlyToPosition && map) {
      map.flyTo({
        center: mapFlyToPosition,
        zoom: 15
      })
    }
  }, [mapFlyToPosition, map])

  const handleZoom = useCallback(evt => {
    const nextSize = getMarkerSizeForZoom(evt.viewState.zoom)
    setMarkerSize(prev => (prev === nextSize ? prev : nextSize))
  }, [])

  const handleMoveEnd = useCallback(
    evt => {
      const { zoom, longitude, latitude } = evt.viewState
      setMarkerSize(prev => {
        const nextSize = getMarkerSizeForZoom(zoom)
        return prev === nextSize ? prev : nextSize
      })
      dispatchView({
        type: 'SetMapPosition',
        mapZoom: zoom,
        mapPosition: [longitude, latitude]
      })
    },
    [dispatchView]
  )

  const clickMap = useCallback(
    event => {
      const features = event.features
      if (features && features.length > 0) {
        for (const feature of features) {
          if (feature.sourceLayer === 'stops') {
            dispatchSearch({
              type: 'SetCurrentStop',
              currentStopId: feature.properties.id
            })
            dispatchView({
              type: 'SetStopDialog',
              stopDialogOpen: true
            })
            break
          }
          if (feature.sourceLayer === 'trips') {
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
      }
    },
    [dispatchSearch, dispatchView]
  )

  const handleMouseEnter = useCallback(() => setCursor('pointer'), [])
  const handleMouseLeave = useCallback(() => setCursor('grab'), [])

  const serviceGeoJsonData = useMemo(() => {
    if (!currentService || !currentService.geojson) return null
    return JSON.parse(currentService.geojson)
  }, [currentService])

  const markers = useMemo(() => {
    if (!mobileLocations || mobileLocations.length === 0) return null
    const now = dayjs()
    return mobileLocations.map(l => {
      const locationPoint = l.getCoordinates(now)
      if (!locationPoint) return null
      const mobile = mobileLookup[l.mobileId]
      const organisation = mobile
        ? organisationLookup[mobile.organisationId]
        : null
      return (
        <Marker
          key={'mkr_' + l.mobileId}
          longitude={locationPoint[0]}
          latitude={locationPoint[1]}
          anchor='bottom'
        >
          <MobileAvatar
            organisation={organisation}
            location={l}
            size={markerSize}
          />
        </Marker>
      )
    })
  }, [mobileLocations, mobileLookup, organisationLookup, markerSize])

  return (
    <>
      <Box sx={{ position: 'absolute', zIndex: 1, mt: 2 }}>
        <PostcodeSearch />
      </Box>
      <Map
        ref={setMap}
        style={MAP_CONTAINER_STYLE}
        mapStyle={MAP_STYLE}
        initialViewState={initialViewState}
        maxZoom={18}
        cursor={cursor}
        interactiveLayerIds={INTERACTIVE_LAYER_IDS}
        onZoom={handleZoom}
        onMoveEnd={handleMoveEnd}
        onClick={clickMap}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {markers}
        {serviceGeoJsonData && (
          <Source id='service-geojson' type='geojson' data={serviceGeoJsonData}>
            <Layer
              id='service-geojson-line'
              type='line'
              paint={SERVICE_GEOJSON_PAINT}
            />
          </Source>
        )}

        {mapSettings.authorityBoundary
          ? (
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
                layout={AUTHORITY_LINE_LAYOUT}
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
            )
          : null}

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
            layout={TRIPS_LINE_LAYOUT}
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
        {searchPosition && searchPosition.length > 1
          ? (
            <Marker longitude={searchPosition[0]} latitude={searchPosition[1]}>
              <MeAvatar searchType={searchType} />
            </Marker>
            )
          : null}
        <NavigationControl position='bottom-left' />
      </Map>
      <Tooltip title='Map settings'>
        <Fab
          aria-label='Map settings'
          sx={{
            position: 'absolute',
            bottom: 28,
            right: 16,
            zIndex: 1
          }}
          onClick={() =>
            dispatchView({
              type: 'SetMapSettingsDialog',
              mapSettingsDialogOpen: true
            })}
        >
          <LayersIcon />
        </Fab>
      </Tooltip>
      <MapSettings
        mapSettings={mapSettings}
        mapSettingsDialogOpen={mapSettingsDialogOpen}
      />
    </>
  )
}

export default MobileMap
