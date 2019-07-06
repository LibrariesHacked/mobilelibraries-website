// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Mapbox GL
import ReactMapboxGl, { ZoomControl, Source, Layer, Marker } from "react-mapbox-gl";

// Our components
import MeAvatar from './MeAvatar';
import MobileAvatar from './MobileAvatar';

import moment from 'moment';

const Map = ReactMapboxGl({
	minZoom: 5,
	maxZoom: 18,
	scrollZoom: true,
	interactive: true,
	dragRotate: true,
	attributionControl: true
});

const stop_tiles = ['https://api.mobilelibraries.org/api/stops/{z}/{x}/{y}.mvt'];

class MobileMap extends Component {

	state = {
		time_update_interval: null,
		current_time: null
	}

	componentDidMount = () => {
		// Set up interval to provide a date every 500 milliseconds
		let time_update_interval = setInterval(this.setCurrentTime, 500);
		this.setState({ time_update_interval: time_update_interval });
	}

	setCurrentTime = () => this.setState({ current_time: moment() });

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
							let location_point = [l.geox, l.geoy];
							if (this.state.current_time && l.route_section && l.route_section.coordinates && l.updated) {
								const milliseconds_passed = moment(this.state.current_time).diff(l.updated);
								const index = Math.round(milliseconds_passed / 500);
								const coords = l.route_section.coordinates;
								if (coords.length > index && index > 0) location_point = coords[index];
								if (coords.length <= index && index > 0) location_point = coords[coords.length - 1];
							}
							return <Marker
								key={'mkr_' + l.id}
								coordinates={location_point}
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
						tiles: stop_tiles
					}} />
				<Layer
					id='lyr_stops_circles'
					type='circle'
					sourceId='src_stops'
					sourceLayer='stop'
					layout={{}}
					paint={{
						'circle-radius': [
							'interpolate',
							['linear'],
							['zoom'],
							5, 2,
							17, 10
						],
						'circle-color': '#607d8b',
						'circle-stroke-width': [
							'interpolate',
							['linear'],
							['zoom'],
							5, 1,
							14, 2
						],
						'circle-stroke-color': '#FFFFFF',
						'circle-opacity': 0.8
					}}
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
							13, 10,
							17, 22
						],
						"text-offset": [0, 1.7],
					}}
					paint={{
						"text-halo-color": "hsl(0, 0%, 100%)",
						"text-halo-width": 1,
						"text-halo-blur": 1,
						"text-color": "#6a6f73"
					}}
				/>
				{this.props.current_position && this.props.current_position.length > 1 ?
					<Marker
						key={'mk_me'}
						coordinates={[this.props.current_position[0], this.props.current_position[1]]}>
						<MeAvatar search_type={this.props.search_type} />
					</Marker>
					: null}
				<ZoomControl position="bottom-right" />
			</Map>
		);
	}
}

MobileMap.propTypes = {
	current_position: PropTypes.array
}

export default MobileMap;