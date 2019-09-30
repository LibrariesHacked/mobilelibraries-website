import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import EventIcon from '@material-ui/icons/Event';
import PrintIcon from '@material-ui/icons/Print';
import WebIcon from '@material-ui/icons/Web';

// Moment
import moment from 'moment';

const config = require('./helpers/config.json');

const styles = theme => ({
    button: {
        margin: theme.spacing(1)
    },
    dialog: {
        border: '1px solid #e5e5e5'
    },
    leftIcon: {
        marginRight: theme.spacing(1)
    },
    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
	progress: {
		margin: theme.spacing(2)
	}
});

class StopDetails extends React.Component {
    state = {}

    getStopCalendar = () => window.open(config.api + '/stops/' + this.props.stop.id + '/ics');
    getStopPdf = () => window.open(config.api + '/stops/' + this.props.stop.id + '/pdf', '_blank');
    goToWebsite = () => window.open(this.props.stop.timetable, '_blank');

    close = () => { this.props.close() }

    render() {
        const { classes, width, stop } = this.props;
        const fullScreen = isWidthDown('sm', width);
        const arrival = moment(stop.arrival, 'HH:mm:ssZ');
        const departure = moment(stop.departure, 'HH:mm:ssZ');
        const duration = moment.duration(departure.diff(arrival)).humanize()
        return (
            <Dialog
                fullScreen={fullScreen}
                disableBackdropClick={true}
                open={this.props.open}
                onClose={this.close}
                aria-labelledby="responsive-dialog-title"
                BackdropProps={
                    {
                        invisible: true
                    }
                }
                PaperProps={
                    {
                        elevation: 0,
                        className: classes.dialog
                    }
                }
            >
                {stop && stop.route_day ?
                    <React.Fragment>
                        <DialogTitle id="responsive-dialog-title">{stop.name}</DialogTitle>
                        <DialogContent>
                            <IconButton className={classes.button} onClick={() => this.getStopCalendar()}>
                                <EventIcon />
                            </IconButton>
                            <IconButton className={classes.button} onClick={() => this.getStopPdf()}>
                                <PrintIcon />
                            </IconButton>
                            <IconButton className={classes.button} onClick={() => this.goToWebsite()}>
                                <WebIcon />
                            </IconButton>
                            <Divider />
                        </DialogContent>
                        <DialogContent>
                            <List className={classes.list}>
                                <ListSubheader>{stop.address}</ListSubheader>
                                <ListItem>
                                    <ListItemText primary={stop.route_day + 'for ' + duration} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={arrival.format('h:mma') + ' - ' + departure.format('h:mma')} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={'Next visiting on ' + (stop.route_dates && stop.route_dates.length > 0 ? stop.route_dates[0] : '')} />
                                </ListItem>
                            </List>
                        </DialogContent>
                    </React.Fragment> : 
                    <CircularProgress className={classes.progress} color="secondary" size={30} />}
                <DialogActions>
                    <Button onClick={() => this.close()} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

StopDetails.propTypes = {
    classes: PropTypes.object.isRequired
};

export default compose(withWidth(), withStyles(styles, { withTheme: true }))(StopDetails);