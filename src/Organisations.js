// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid';
import ListSubheader from '@material-ui/core/ListSubheader';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

import OrganisationCard from './OrganisationCard';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Organisations extends Component {
	state = {
	};

	render() {
		const { classes, organisations } = this.props;
		return (
			<div className={classes.root}>
				<ListSubheader>Mobile library organisations</ListSubheader>
				<Grid container spacing={3}>
					{organisations.map((organisation, idx) => {
						return (
							<OrganisationCard
								key={'crd_' + organisation.name.replace(' ', '') + '_' + idx}
								organisation={organisation}
								viewStopsByOrganisation={this.props.viewStopsByOrganisation}
							/>
						)
					})}
				</Grid>
			</div>
		);
	}
}

Organisations.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Organisations);