// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Material UI
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';

// MUI Icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = theme => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1
		}
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar
	}
});

class AppDrawer extends Component {

	render() {
		const { drawer_open, classes, theme } = this.props;
		return (
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: drawer_open,
					[classes.drawerClose]: !drawer_open,
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: drawer_open,
						[classes.drawerClose]: !drawer_open,
					}),
				}}
				open={drawer_open}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={() => this.props.closeDrawer()}>
						{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</div>
			</Drawer>
		);
	}
}

AppDrawer.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(AppDrawer);