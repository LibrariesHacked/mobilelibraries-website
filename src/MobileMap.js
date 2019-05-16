// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Mapbox GL
import ReactMapboxGl, { ZoomControl, Source, Layer } from "react-mapbox-gl";

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
		return (
			<Map
				style='style.json'  // eslint-disable-line react/style-prop-object
				center={this.props.position}
				zoom={this.props.zoom}
				maxZoom={17}
				pitch={this.props.pitch}
				bearing={this.props.bearing}
				fitBounds={this.props.fit_bounds}
				containerStyle={{ top: 0, bottom: 0, right: 0, left: 0, height: '100vh', width: '100vw', position: 'absolute' }}
			>
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
						'text-field': 'name',
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