// React
import React from 'react';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Material UI Styles
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
	},
	grow: {
		flexGrow: 1,
	},
});

function AppHeader() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<AppBar position="static" color="default" elevation={0}>
				<Toolbar>
					<Typography variant="h6" color="inherit">Mobile Libraries</Typography>
					<div className={classes.grow} />
					<Button color="inherit">Dashboard</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
}

export default AppHeader;