import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'

import Map, {
  Source,
  Layer,
  Marker,
  NavigationControl,
  AttributionControl
} from 'react-map-gl/maplibre'

import LayersIcon from '@mui/icons-material/LayersRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import MeAvatar from './MeAvatar'
import MapSettings from './MapSettings'
import PostcodeSearch from './PostcodeSearch'

import * as stopModel from './models/stops'

import config from './helpers/config.json'

const libraryAuthorityTiles = config.libraryAuthorityTiles
const stopTiles = config.stopTiles
const tripTiles = config.tripTiles

const MobileMap = props => {
  const { containerStyle } = props
  const [
    {
      searchType,
      searchPosition,
      currentStopId,
      currentLibraryId,
      currentPoint,
      currentService
    },
    dispatchSearch
  ] = useSearchStateValue() //eslint-disable-line
  const [
    {
      mapZoom,
      mapPosition,
      mapSettings,
      mapSettingsDialogOpen,
      mapFlyToPosition,
      mapBounds,
      loadingLibraryOrMobileLibrary
    },
    dispatchView
  ] = useViewStateValue() //eslint-disable-line

  const [map, setMap] = useState(null)

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

  const setViewState = viewState => {
    dispatchView({
      type: 'SetMapPosition',
      mapZoom: viewState.zoom,
      mapPosition: [viewState.longitude, viewState.latitude]
    })
  }

  const clickStop = async (feature, point) => {
    const id = feature.properties.id
    const stop = await stopModel.getStopById(id)
    dispatchSearch({
      type: 'SetCurrentStop',
      currentStopId: id,
      currentPoint: [stop.longitude, stop.latitude]
    })
  }

  const clickMap = async event => {
    if (loadingLibraryOrMobileLibrary) return
    dispatchView({
      type: 'ToggleLoadingLibraryOrMobileLibrary'
    })
    const features = map.queryRenderedFeatures(event.point)
    if (features && features.length > 0) {
      for (const feature of features) {
        if (feature.sourceLayer === 'stop') {
          await clickStop(feature, event.point)
          break
        }
      }
    }
    dispatchView({
      type: 'ToggleLoadingLibraryOrMobileLibrary'
    })
  }

  return (
    <>
      <Box sx={{ position: 'absolute', marginTop: theme => theme.spacing(2) }}>
        <PostcodeSearch />
      </Box>
      <Map
        ref={setMap}
        style={containerStyle}
        mapStyle='https://zoomstack.librarydata.uk/light.json'
        longitude={mapPosition[0]}
        latitude={mapPosition[1]}
        zoom={mapZoom}
        maxZoom={18}
        onMove={evt => setViewState(evt.viewState)}
        onClick={clickMap}
      >
        <AttributionControl customAttribution='Contains OS data © Crown copyright and database right 2023' />
        {currentService && currentService.geojson ? (
          <Source type='geojson' data={JSON.parse(currentService.geojson)}>
            <Layer
              type='line'
              paint={{
                'line-opacity': 0.4,
                'line-width': 2,
                'line-color': '#455a64'
              }}
            />
          </Source>
        ) : null}

        <Source type='vector' tiles={[libraryAuthorityTiles]}>
          {mapSettings.authorityBoundary ? (
            <Layer
              type='line'
              source-layer='library_authority_boundaries'
              minzoom={6}
              layout={{
                'line-join': 'round',
                'line-cap': 'square'
              }}
              paint={{
                'line-color': '#a7a39b',
                'line-opacity': 1,
                'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 18, 4]
              }}
            />
          ) : null}
          {mapSettings.authorityBoundary ? (
            <Layer
              type='fill'
              source-layer='library_authority_boundaries'
              minzoom={6}
              paint={{
                'fill-color': '#ccc',
                'fill-opacity': 0.1
              }}
            />
          ) : null}
        </Source>
        <Source type='vector' tiles={[tripTiles]}>
          <Layer
            type='line'
            source-layer='trip'
            minzoom={14}
            layout={{
              'line-join': 'round',
              'line-cap': 'square'
            }}
            paint={{
              'line-color': '#a7a39b',
              'line-offset': [
                'interpolate',
                ['linear'],
                ['zoom'],
                14,
                1,
                18,
                4
              ],
              'line-opacity': 1,
              'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 18, 4],
              'line-dasharray': [2, 0.5]
            }}
          />
        </Source>
        <Source type='vector' tiles={[stopTiles]}>
          {mapSettings.mobileLibraryStops ? (
            <Layer
              type='circle'
              source-layer='stop'
              minzoom={5}
              layout={{}}
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  5,
                  2,
                  18,
                  8
                ],
                'circle-color': '#455a64',
                'circle-stroke-width': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  5,
                  1,
                  18,
                  3
                ],
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.5
              }}
            />
          ) : null}
          {mapSettings.mobileLibraryStops ? (
            <Layer
              type='symbol'
              source-layer='stop'
              minzoom={13}
              layout={{
                'text-ignore-placement': false,
                'text-field': ['concat', 'Mobile: ', ['get', 'name']],
                'text-font': ['Source Sans Pro Bold'],
                'text-line-height': 1,
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13,
                  12,
                  18,
                  18
                ],
                'text-offset': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13,
                  ['literal', [0, 1.5]],
                  18,
                  ['literal', [0, 2]]
                ]
              }}
              paint={{
                'text-halo-color': 'hsl(0, 0%, 100%)',
                'text-halo-width': 1,
                'text-halo-blur': 1,
                'text-color': '#6a6f73'
              }}
            />
          ) : null}
          {mapSettings.mobileLibraryStops ? (
            <Layer
              type='symbol'
              source-layer='stop'
              minzoom={14}
              layout={{
                'text-ignore-placement': false,
                'text-field': ['to-string', ['get', 'next_visiting']],
                'text-font': ['Source Sans Pro Bold'],
                'text-line-height': 1,
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  10,
                  18,
                  16
                ],
                'text-offset': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13,
                  ['literal', [0, -1.5]],
                  18,
                  ['literal', [0, -2]]
                ]
              }}
              paint={{
                'text-halo-color': 'hsl(0, 0%, 100%)',
                'text-halo-width': 1,
                'text-halo-blur': 1,
                'text-color': '#6a6f73'
              }}
            />
          ) : null}
        </Source>
        {searchPosition && searchPosition.length > 1 ? (
          <Marker longitude={searchPosition[0]} latitude={searchPosition[1]}>
            <MeAvatar searchType={searchType} />
          </Marker>
        ) : null}
        <NavigationControl position='bottom-left' />
      </Map>
      <Tooltip title='Map settings'>
        <Fab
          color='primary'
          sx={{
            position: 'absolute',
            bottom: 28,
            right: 16,
            zIndex: 1,
            color: 'white'
          }}
          onClick={() =>
            dispatchView({
              type: 'SetMapSettingsDialog',
              mapSettingsDialogOpen: true
            })
          }
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
