import React, { useEffect, useState } from 'react'

import moment from 'moment'

import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'

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

const libraryAuthorityTiles = config.libraryAuthorityTiles
const mobileTiles = config.mobileTiles

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

  const clickStop = async feature => {
    const id = feature.properties.id
    dispatchSearch({
      type: 'SetCurrentStop',
      currentStopId: id
    })
    dispatchView({
      type: 'SetStopDialog',
      stopDialogOpen: true
    })
  }

  const clickTrip = feature => {
    const id = feature.properties.id
    dispatchSearch({
      type: 'SetCurrentTrip',
      currentTripId: id
    })
    dispatchView({
      type: 'SetTripDialog',
      tripDialogOpen: true
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
        if (feature.sourceLayer === 'stops') {
          await clickStop(feature)
          break
        }
        if (feature.sourceLayer === 'trips') {
          clickTrip(feature)
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
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        mapStyle='https://api.maptiler.com/maps/dataviz/style.json?key=1OK05AJqNta7xYzrG2kA'
        longitude={mapPosition[0]}
        latitude={mapPosition[1]}
        zoom={mapZoom}
        maxZoom={18}
        onMove={evt => setViewState(evt.viewState)}
        onClick={clickMap}
      >
        {
          // The mobile library locations
          mobileLocations && mobileLocations.length > 0
            ? mobileLocations.map(l => {
                if (!l.geoX || !l.geoY) return null
                let locationPoint = [l.geoX, l.geoY]
                if (l.routeSection && l.routeSection.coordinates && l.updated) {
                  const millisecondsPassed = moment(Date.now()).diff(l.updated)
                  const index = Math.round(millisecondsPassed / 500)
                  const coords = l.routeSection.coordinates
                  if (coords.length > index && index > 0) {
                    locationPoint = coords[index]
                  }
                  if (coords.length <= index && index > 0) {
                    locationPoint = coords[coords.length - 1]
                  }
                }
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
                      zoom={map ? map.getZoom() : 0}
                    />
                  </Marker>
                )
              })
            : null
        }
        {currentService && currentService.geojson && (
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
        )}

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

        <Source type='vector' tiles={[mobileTiles]} maxzoom={14}>
          <Layer
            type='line'
            source-layer='trips'
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
          <Layer
            type='circle'
            source-layer='stops'
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
          <Layer
            type='symbol'
            source-layer='stops'
            minzoom={13}
            layout={{
              'text-ignore-placement': false,
              'text-field': ['get', 'name'],
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
          <Layer
            type='symbol'
            source-layer='stops'
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
