// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

// Mapbox GL
import ReactMapboxGl, { ZoomControl, Source, Layer, Marker } from "react-mapbox-gl";

// Our components
import MeAvatar from './MeAvatar';
import MapSettings from './MapSettings';
import MobileAvatar from './MobileAvatar';

// Mui Icons
import LayersIcon from '@material-ui/icons/LayersTwoTone';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

import moment from 'moment';

const styles = theme => ({
  settings: {
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  }
});

const config = require('./helpers/config.json');

const Map = ReactMapboxGl({
  minZoom: 5,
  maxZoom: 18,
  customAttribution: 'Contains public sector information licensed under the Open Government Licence'
});

const stop_tiles = [config.stop_tiles];
const trip_tiles = [config.trip_tiles];
const library_authority_tiles = [config.library_authority_tiles];

class MobileMap extends Component {

  state = {
    time_update_interval: null,
    current_time: null,
    map: null,
    settings_dialog_open: false
  }

  componentDidMount = () => {
    // Set up interval to provide a date every 500 milliseconds
    let time_update_interval = setInterval(this.setCurrentTime, 500);
    this.setState({ time_update_interval: time_update_interval });
  }

  clickStop = (map) => {
    if (map && map.features && map.features.length > 0 && map.features[0].properties) {
      this.props.viewStop({ id: map.features[0].properties.id });
    }
  }

  clickTrip = (map) => {
    if (map && map.features && map.features.length > 0 && map.features[0].properties) {
      this.props.viewTrip(map.features[0].properties);
    }
  }

  setCurrentTime = () => this.setState({ current_time: moment() });

  render() {
    const { classes, position, zoom, pitch, bearing, fitBounds, mapSettings, mobileLocations, mobileLookup, organisations, organisationLookup, toggleMapSetting } = this.props;

    // Build the colour match
    let organisation_colour_match = ['match', ['get', 'utla19cd']]
    organisations.forEach(org => {
      organisation_colour_match.push(org.code);
      organisation_colour_match.push(org.colour);
    });
    organisation_colour_match.push('#a7a39b');

    return (
      <React.Fragment>
        <Map
          style='style.json'  // eslint-disable-line react/style-prop-object
          center={position}
          zoom={zoom}
          maxZoom={17}
          pitch={pitch}
          bearing={bearing}
          fitBounds={fitBounds}
          containerStyle={{ top: 0, bottom: 0, right: 0, left: 0, height: '100vh', width: '100vw', position: 'absolute' }}
          onStyleLoad={map => this.setState({ map: map })}
        >
          { // The mobile library locations
            mobileLocations && mobileLocations.length > 0 ?
              mobileLocations.map(l => {
                let location_point = [l.geox, l.geoy];
                if (current_time && l.route_section && l.route_section.coordinates && l.updated) {
                  const milliseconds_passed = moment(current_time).diff(l.updated);
                  const index = Math.round(milliseconds_passed / 500);
                  const coords = l.route_section.coordinates;
                  if (coords.length > index && index > 0) location_point = coords[index];
                  if (coords.length <= index && index > 0) location_point = coords[coords.length - 1];
                }
                const mobile = mobileLookup[l.mobileId];
                const organisation = (mobile ? organisationLookup[mobile.organisationId] : null);
                return <Marker
                  key={'mkr_' + l.id}
                  coordinates={location_point}
                  anchor="bottom">
                  <MobileAvatar
                    organisation={organisation}
                    location={l}
                    zoom={map ? map.getZoom() : 0}
                  />
                </Marker>
              }) : null
          }
          <Source
            id='src_stops'
            tileJsonSource={{
              type: 'vector',
              tiles: stop_tiles
            }} />
          <Source
            id='src_trips'
            tileJsonSource={{
              type: 'vector',
              tiles: trip_tiles
            }} />
          <Source
            id='src_library_authorities'
            tileJsonSource={{
              type: 'vector',
              tiles: library_authority_tiles
            }} />
          <Layer
            id='lyr_trips_lines'
            type='line'
            sourceId='src_trips'
            sourceLayer='trip'
            minZoom={13}
            layout={{
              "line-join": "round",
              "line-cap": "square"
            }}
            paint={{
              "line-color": "#a7a39b",
              "line-offset": [
                "interpolate",
                [
                  "linear"
                ],
                [
                  "zoom"
                ],
                13, 0.5,
                14, 1,
                15, 2,
                16, 3,
                18, 10,
                22, 20
              ],
              "line-opacity": 1,
              "line-width": [
                "interpolate",
                [
                  "linear"
                ],
                [
                  "zoom"
                ],
                13, 0.5,
                14, 1,
                15, 2,
                16, 3,
                18, 10,
                22, 20
              ],
              "line-dasharray": [
                2,
                0.5
              ]
            }}
            onClick={this.clickTrip}
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
            onClick={this.clickStop}
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
              "text-font": [
                "Source Sans Pro Bold"
              ],
              "text-line-height": 1,
              "text-size": [
                "interpolate",
                [
                  "linear"
                ],
                [
                  "zoom"
                ],
                13, 12,
                17, 22
              ],
              "text-offset": [0, 2],
            }}
            paint={{
              "text-halo-color": "hsl(0, 0%, 100%)",
              "text-halo-width": 1,
              "text-halo-blur": 1,
              "text-color": "#6a6f73"
            }}
            onClick={this.clickStop}
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
              "text-font": [
                "Source Sans Pro Bold"
              ],
              "text-line-height": 1,
              "text-size": [
                "interpolate",
                [
                  "linear"
                ],
                [
                  "zoom"
                ],
                13, 10,
                17, 16
              ],
              "text-offset": [0, -2.8],
            }}
            paint={{
              "text-halo-color": "hsl(0, 0%, 100%)",
              "text-halo-width": 1,
              "text-halo-blur": 1,
              "text-color": "#6a6f73"
            }}
            onClick={this.clickStop}
          />
          {mapSettings.authorityBoundary ?
            <React.Fragment>
              <Layer
                id='lyr_library_authorities_lines'
                type='line'
                sourceId='src_library_authorities'
                sourceLayer='library_authority_boundaries'
                minZoom={6}
                layout={{
                  "line-join": "round",
                  "line-cap": "square"
                }}
                paint={{
                  "line-color": "#a7a39b",
                  "line-opacity": 1,
                  "line-width": [
                    "interpolate",
                    [
                      "linear"
                    ],
                    [
                      "zoom"
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
                  'fill-color': organisation_colour_match,
                  'fill-opacity': 0.1
                }}
              />
            </React.Fragment>
            : null}
          {this.props.currentPosition && this.props.currentPosition.length > 1 ?
            <Marker
              key={'mk_me'}
              coordinates={[this.props.currentPosition[0], this.props.currentPosition[1]]}>
              <MeAvatar searchType={this.props.searchType} />
            </Marker>
            : null}
          <ZoomControl position="bottom-left" />
        </Map>
        <Tooltip
          title={'Map settings'}
        >
          <Fab
            size="small"
            className={classes.settings}
            color='primary'
            style={{
              color: 'white',
              border: '1px solid #FFFFFF'
            }}
            onClick={() => this.setState({ settings_dialog_open: true })}
          >
            <LayersIcon />
          </Fab>
        </Tooltip>
        <MapSettings
          mapSettings={mapSettings}
          open={settings_dialog_open}
          toggleMapSetting={toggleMapSetting}
          close={() => this.setState({ settings_dialog_open: false, settings_dial_open: false })}
        />
      </React.Fragment>
    );
  }
}

MobileMap.propTypes = {
  currentPosition: PropTypes.array
}

export default withStyles(styles, { withTheme: true })(MobileMap);