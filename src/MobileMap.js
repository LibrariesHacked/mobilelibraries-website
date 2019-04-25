// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Mapbox GL
import ReactMapboxGl, { ZoomControl } from "react-mapbox-gl";

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
				<ZoomControl position="bottom-right" />
			</Map>
		);
	}
}

MobileMap.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MobileMap);