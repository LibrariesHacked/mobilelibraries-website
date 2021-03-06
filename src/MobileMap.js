import React, { useEffect, useState } from 'react'

import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

import ReactMapboxGl, { ZoomControl, Source, Layer, Marker } from 'react-mapbox-gl'

import LayersIcon from '@material-ui/icons/LayersTwoTone'

import { makeStyles } from '@material-ui/core/styles'

import moment from 'moment'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import MeAvatar from './MeAvatar'
import MapSettings from './MapSettings'
import MobileAvatar from './MobileAvatar'

const useStyles = makeStyles((theme) => ({
  settings: {
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(4)
  }
}))

const config = require('./helpers/config.json')

const Map = ReactMapboxGl({
  minZoom: 5,
  maxZoom: 18,
  customAttribution: 'Contains public sector information licensed under the Open Government Licence'
})

const stopTiles = [config.stopTiles]
const tripTiles = [config.tripTiles]
const libraryAuthorityTiles = [config.libraryAuthorityTiles]

function MobileMap () {
  const [{ organisations, organisationLookup, mobileLookup, mobileLocations }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ searchType, searchPosition }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ mapZoom, mapPosition, mapSettings, mapSettingsDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [currentTime, setCurrentTime] = useState(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    const setTime = () => setCurrentTime(moment())
    setInterval(setTime, 500)
  }, [])

  const clickStop = (map) => {
    if (map && map.features && map.features.length > 0 && map.features[0].properties) {
      dispatchSearch({ type: 'SetCurrentStop', stopId: map.features[0].properties.id })
      dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
    }
  }

  const clickTrip = (map) => {
    if (map && map.features && map.features.length > 0 && map.features[0].properties) {
      dispatchSearch({ type: 'SetCurrentTrip', tripId: map.features[0].properties.id })
      dispatchView({ type: 'SetTripDialog', tripDialogOpen: true })
    }
  }

  // Build the colour match
  const organisationColourMatch = ['match', ['get', 'utla19cd']]
  organisations.forEach(org => {
    organisationColourMatch.push(org.code)
    organisationColourMatch.push(org.colour)
  })
  organisationColourMatch.push('#a7a39b')

  const classes = useStyles()

  const locations = mobileLocations.filter(l => l.geoX !== null && l.geoY !== null)

  return (
    <>
      <Map
        style='style.json' // eslint-disable-line
        center={mapPosition}
        zoom={mapZoom}
        maxZoom={17}
        pitch={[0]}
        bearing={[0]}
        fitBounds={null}
        containerStyle={{ top: 0, bottom: 0, right: 0, left: 0, height: '100vh', width: '100vw', position: 'absolute' }}
        onStyleLoad={map => setMap(map)}
      >
        {// The mobile library locations
          locations && locations.length > 0
            ? locations.map(l => {
              let locationPoint = [l.geoX, l.geoY]
              if (currentTime && l.routeSection && l.routeSection.coordinates && l.updated) {
                const millisecondsPassed = moment(currentTime).diff(l.updated)
                const index = Math.round(millisecondsPassed / 500)
                const coords = l.routeSection.coordinates
                if (coords.length > index && index > 0) locationPoint = coords[index]
                if (coords.length <= index && index > 0) locationPoint = coords[coords.length - 1]
              }
              const mobile = mobileLookup[l.mobileId]
              const organisation = (mobile ? organisationLookup[mobile.organisationId] : null)
              return (
                <Marker
                  key={'mkr_' + l.id}
                  coordinates={locationPoint}
                  anchor='bottom'
                >
                  <MobileAvatar
                    organisation={organisation}
                    location={l}
                    zoom={map ? map.getZoom() : 0}
                  />
                </Marker>)
            }) : null
        }
        <Source
          id='src_stops'
          tileJsonSource={{
            type: 'vector',
            tiles: stopTiles
          }}
        />
        <Source
          id='src_trips'
          tileJsonSource={{
            type: 'vector',
            tiles: tripTiles
          }}
        />
        <Source
          id='src_library_authorities'
          tileJsonSource={{
            type: 'vector',
            tiles: libraryAuthorityTiles
          }}
        />
        <Layer
          id='lyr_trips_lines'
          type='line'
          sourceId='src_trips'
          sourceLayer='trip'
          minZoom={13}
          layout={{
            'line-join': 'round',
            'line-cap': 'square'
          }}
          paint={{
            'line-color': '#a7a39b',
            'line-offset': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              13, 0.5,
              14, 1,
              15, 2,
              16, 3,
              18, 10,
              22, 20
            ],
            'line-opacity': 1,
            'line-width': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              13, 0.5,
              14, 1,
              15, 2,
              16, 3,
              18, 10,
              22, 20
            ],
            'line-dasharray': [
              2,
              0.5
            ]
          }}
          onClick={clickTrip}
        />
        <Layer
          id='lyr_stops_circles'
          type='circle'
          sourceId='src_stops'
          sourceLayer='stop'
          minZoom={5}
          layout={{}}
          paint={{
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 2,
              17, 12
            ],
            'circle-color': ['get', 'organisation_colour'],
            'circle-stroke-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 1,
              17, 4
            ],
            'circle-stroke-color': '#FFFFFF',
            'circle-opacity': 0.7
          }}
          onClick={clickStop}
        />
        <Layer
          id='lyr_stops_labels'
          type='symbol'
          sourceId='src_stops'
          sourceLayer='stop'
          minZoom={13}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['to-string', ['get', 'name']],
            'text-font': [
              'Source Sans Pro Bold'
            ],
            'text-line-height': 1,
            'text-size': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              13, 12,
              17, 22
            ],
            'text-offset': [0, 2]
          }}
          paint={{
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 1,
            'text-halo-blur': 1,
            'text-color': '#6a6f73'
          }}
          onClick={clickStop}
        />
        <Layer
          id='lyr_stops_next_visiting'
          type='symbol'
          sourceId='src_stops'
          sourceLayer='stop'
          minZoom={13}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['to-string', ['get', 'next_visiting']],
            'text-font': [
              'Source Sans Pro Bold'
            ],
            'text-line-height': 1,
            'text-size': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              13, 10,
              17, 16
            ],
            'text-offset': [0, -2.8]
          }}
          paint={{
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 1,
            'text-halo-blur': 1,
            'text-color': '#6a6f73'
          }}
          onClick={clickStop}
        />
        {mapSettings.authorityBoundary
          ? (
            <>
              <Layer
                id='lyr_library_authorities_lines'
                type='line'
                sourceId='src_library_authorities'
                sourceLayer='library_authority_boundaries'
                minZoom={6}
                layout={{
                  'line-join': 'round',
                  'line-cap': 'square'
                }}
                paint={{
                  'line-color': '#a7a39b',
                  'line-opacity': 1,
                  'line-width': [
                    'interpolate',
                    [
                      'linear'
                    ],
                    [
                      'zoom'
                    ],
                    6, 1,
                    22, 4
                  ]
                }}
              />
              <Layer
                id='lyr_library_authorities_fill'
                type='fill'
                sourceId='src_library_authorities'
                sourceLayer='library_authority_boundaries'
                minZoom={6}
                paint={{
                  'fill-color': organisationColourMatch,
                  'fill-opacity': 0.1
                }}
              />
            </>
          ) : null}
        {searchPosition && searchPosition.length > 1
          ? (
            <Marker
              key='mk_me'
              coordinates={[searchPosition[0], searchPosition[1]]}
            >
              <MeAvatar searchType={searchType} />
            </Marker>
          )
          : null}
        <ZoomControl position='bottom-left' />
      </Map>
      <Tooltip
        title='Map settings'
      >
        <Fab
          size='small'
          className={classes.settings}
          color='primary'
          style={{
            color: 'white',
            border: '1px solid #FFFFFF'
          }}
          onClick={() => dispatchView({ type: 'SetMapSettingsDialog', mapSettingsDialogOpen: true })}
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
