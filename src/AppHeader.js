// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Material Icons
import MenuIcon from '@material-ui/icons/Menu';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = theme => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		}),
	},
	menuButton: {
		marginRight: 36
	},
	hide: {
		display: 'none'
	}
});

class AppHeader extends Component {

	render() {
		const { classes, drawer_open } = this.props;

		return (
			<AppBar
				position="fixed"
				elevation={0}
				color="default"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: drawer_open,
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="Open drawer"
						onClick={() => this.props.openDrawer()}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: drawer_open
						})}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" color="inherit" noWrap>Mobile Libraries</Typography>
				</Toolbar>
			</AppBar>
		);
	}
}

AppHeader.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(AppHeader);