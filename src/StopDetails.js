import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

// MUI Icons
import EventIcon from '@material-ui/icons/Event';
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
                {stop && stop.route_day ?
                    <React.Fragment>
                        <DialogTitle id="dlg-title">{stop.name}</DialogTitle>
                        <DialogContent>
                        <Typography>{'Next visiting on ' + (stop.route_dates && stop.route_dates.length > 0 ? moment(stop.route_dates[0], 'YYYY-MM-DD').format('Mo MMMM') : '')}</Typography>
                            <List className={classes.list}>
                                <ListSubheader>Stop details</ListSubheader>
                                <ListItem>
                                    <ListItemText primary={stop.organisation_name} secondary={stop.mobile_name + ' mobile'} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => this.goToWebsite()}>
                                            <WebIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={stop.route_day} secondary={arrival.format('h:mma') + ' - ' + departure.format('h:mma') + '(' + duration + ')'} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => this.getStopCalendar()}>
                                            <EventIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={stop.community} secondary={stop.address} />
                                </ListItem>
                            </List>
                        </DialogContent>
                    </React.Fragment> :
                    <CircularProgress className={classes.progress} color="secondary" size={30} />}
                <DialogActions>
                    <Button onClick={() => this.getStopPdf()} color="primary">Timetable</Button>
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