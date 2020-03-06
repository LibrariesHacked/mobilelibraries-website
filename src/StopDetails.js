import React from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";
import compose from 'recompose/compose';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import EventIcon from '@material-ui/icons/Event';
import PrintIcon from '@material-ui/icons/Print';
import LocationOnIcon from '@material-ui/icons/LocationOn';

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
    viewMapStop = () => this.props.viewMapStop(this.props.stop.longitude, this.props.stop.latitude);
    goToWebsite = () => window.open(this.props.stop.timetable, '_blank');

    close = () => { this.props.close() }

    render() {
        const { classes, width, stop } = this.props;
        const fullScreen = isWidthDown('sm', width);
        return (
            <Dialog
                fullScreen={fullScreen}
                disableBackdropClick={true}
                open={this.props.open}
                onClose={this.close}
                aria-labelledby="dlg-title"
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
                {stop && stop.route_days ?
                    <React.Fragment>
                        <DialogTitle id="dlg-title">{stop.name + '. ' + stop.community}</DialogTitle>
                        <DialogContent>
                            <ListSubheader>{(stop.route_schedule && stop.route_schedule.length > 0 ? moment(stop.route_schedule[0]).format('dddd Do MMMM h:mma') : '')}</ListSubheader>
                           
                            <br />
                            <Divider />
                            <br />
                            <Button onClick={() => this.getStopCalendar()} className={classes.button} color="primary" startIcon={<EventIcon />}>Calendar</Button>
                            <Button onClick={() => this.getStopPdf()} className={classes.button} color="primary" startIcon={<PrintIcon />}>Timetable</Button>
                            <Button onClick={() => this.viewMapStop()} className={classes.button} color="primary" startIcon={<LocationOnIcon />} component={Link} to="/map">Map</Button>
                        </DialogContent>
                    </React.Fragment> :
                    <CircularProgress className={classes.progress} color="secondary" size={30} />}
                <DialogActions>
                    <Button onClick={() => this.goToWebsite()} color="primary">Website</Button>
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