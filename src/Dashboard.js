// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';
import DashboardMobile from './DashboardMobile';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Dashboard extends Component {
	state = {
	};

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<Grid container spacing={3}>
					{this.props.mobiles.map((mobile, idx) => {
						return (
							<DashboardMobile
								key={'dsm_' + mobile.name.replace(' ', '') + '_' + idx}
								mobile={mobile}
							/>
						)
					})}
				</Grid>
			</div>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Dashboard);