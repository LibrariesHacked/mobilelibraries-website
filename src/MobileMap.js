// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Mapbox GL
import ReactMapboxGl, { ZoomControl, Source, Layer, Marker } from "react-mapbox-gl";

import MobileAvatar from './MobileAvatar';

const Map = ReactMapboxGl({
	minZoom: 5,
	maxZoom: 18,
	scrollZoom: true,
	interactive: true,
	dragRotate: true,
	attributionControl: true
});

class MobileMap extends Component {

	render() {
		const { position, zoom, pitch, bearing, fit_bounds, mobile_locations, mobile_lookup } = this.props;
		return (
			<Map
				style='style.json'  // eslint-disable-line react/style-prop-object
				center={position}
				zoom={zoom}
				maxZoom={17}
				pitch={pitch}
				bearing={bearing}
				fitBounds={fit_bounds}
				containerStyle={{ top: 0, bottom: 0, right: 0, left: 0, height: '100vh', width: '100vw', position: 'absolute' }}
			>
				{ // The mobile library locations
					mobile_locations && mobile_locations.length > 0 ?
						mobile_locations.map(l => {
							return <Marker
								coordinates={[l.geox, l.geoy]}
								anchor="bottom">
								<MobileAvatar
									mobile={mobile_lookup[l.mobile_id]}
								/>
							</Marker>
						}) : null
				}
				<Source
					id='src_stops'
					tileJsonSource={{
						type: 'vector',
						tiles: [
							'https://api.mobilelibraries.org/api/stops/{z}/{x}/{y}.mvt',
						],
					}} />
				<Layer
					id='lyr_stops_circles'
					type='circle'
					sourceId='src_stops'
					sourceLayer='stop'
					layout={{}}
					paint={{
						'circle-radius': {
							'base': 1.75,
							'stops': [[9, 5], [22, 180]]
						},
						'circle-color': '#36A2EB',
						'circle-stroke-width': {
							'base': 1,
							'stops': [[9, 2], [22, 10]]
						},
						'circle-stroke-color': '#FFFFFF',
						'circle-opacity': 0.8
					}}
				/>
				<Layer
					id='lyr_stops_labels'
					type='symbol'
					sourceId='src_stops'
					sourceLayer='stop'
					minZoom={12}
					layout={{
						'text-ignore-placement': true,
						'text-field': ['to-string', ['get', 'name']],
						"text-font": [
							"Source Sans Pro Regular"
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
							10,
							8,
							15,
							10,
							22,
							25
						],
						"text-offset": [0, 1.8],
					}}
					paint={{
						"text-halo-color": "hsl(0, 0%, 100%)",
						"text-halo-width": 1,
						"text-halo-blur": 1,
						"text-color": "#6a6f73"
					}}
				/>
				<ZoomControl position="bottom-right" />
			</Map>
		);
	}
}

MobileMap.propTypes = {
	classes: PropTypes.object.isRequired
}

export default MobileMap;