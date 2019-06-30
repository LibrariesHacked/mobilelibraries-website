// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

});

class RouteFilterCard extends Component {
	state = {
	};

	render() {
		const { classes, route_lookup, route_filter } = this.props;
		return (
			<CardContent>
				<Typography variant="h6" component="h2">{route_lookup[route_filter[0]].name}</Typography>
			</CardContent>
		);
	}
}

RouteFilterCard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(RouteFilterCard);