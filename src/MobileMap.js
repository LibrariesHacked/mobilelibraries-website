// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Mapbox GL
import ReactMapboxGl, { ZoomControl, Source, Layer, Marker } from "react-mapbox-gl";

import MobileAvatar from './MobileAvatar';

const styles = theme => ({

});

const Map = ReactMapboxGl({
	minZoom: 7,
	maxZoom: 18,
	scrollZoom: true,
	interactive: true,
	dragRotate: true,
	attributionControl: true
});

class MobileMap extends Component {
	state = {
	};

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
						'circle-radius': 4,
						'circle-color': '#36A2EB',
						'circle-stroke-width': 1,
						'circle-stroke-color': '#FFFFFF',
						'circle-opacity': 0.8
					}}
				/>
				<Layer
					id='lyr_stops_labels'
					type='symbol'
					sourceId='src_stops'
					sourceLayer='stop'
					layout={{
						'text-ignore-placement': true,
						'text-field': ['to-string', ['get', 'name']],
						'text-size': [
							'interpolate',
							['linear'],
							['zoom'],
							12,
							9,
							14,
							11
						],
						'text-font': [
							'Source Sans Pro Regular'
						],
						'text-line-height': 1,
						'text-anchor': 'top'
					}}
					paint={{
						'text-halo-color': '#FFFFFF',
						'text-halo-width': 1,
						'text-halo-blur': 1,
						'text-color': '#36A2EB'
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

export default withStyles(styles, { withTheme: true })(MobileMap);