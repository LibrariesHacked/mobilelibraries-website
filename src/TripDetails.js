import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    dialog: {
        border: '1px solid #e5e5e5'
    }
});

class TripDetails extends React.Component {
    state = {}

    close = () => { this.props.close() }

    render() {
        const { classes, width, trip } = this.props;
        const fullScreen = isWidthDown('sm', width);
        const estimated_duration = Math.round(trip.duration / 60) + ' mins journey time.';
        const scheduled_duration = Math.round(trip.scheduled_duration / 60) + ' mins scheduled between stops.';
        const distance = Math.round(trip.distance / 1609, 1) + ' mile(s)';
        return (
            <Dialog
                fullScreen={fullScreen}
                disableBackdropClick={true}
                open={this.props.open}
                onClose={this.close}
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
                <DialogTitle>{trip.mobile_name + ' trip'}</DialogTitle>
                <DialogContent>
                <ListSubheader disableSticky>{'From ' + trip.origin_stop_name + ' to ' + trip.destination_stop_name}</ListSubheader>
                <Typography variant="body2" component="p">{estimated_duration + ' ' + distance}</Typography>
                <Typography variant="body2" component="p">{scheduled_duration}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.close()} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

TripDetails.propTypes = {
    classes: PropTypes.object.isRequired
};

export default compose(withWidth(), withStyles(styles, { withTheme: true }))(TripDetails);