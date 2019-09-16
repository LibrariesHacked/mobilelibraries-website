import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

// Moment
import moment from 'moment';

const styles = theme => ({
    dialog: {
        border: '1px solid #e5e5e5'
    },
    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
});

class TripDetails extends React.Component {
    state = {}

    close = () => { this.props.close() }

    render() {
        const { classes, width, trip } = this.props;
        const fullScreen = isWidthDown('sm', width);
        const estimated_duration = 'Estimated duration: ' + Math.round(trip.duration / 60) + ' mins';
        const scheduled_duration = 'Time between stops: ' + Math.round(trip.scheduled_duration / 60) + ' mins';
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
                <DialogTitle id="responsive-dialog-title">{''}</DialogTitle>
                <DialogContent>
                    <List className={classes.list}>
                        <ListSubheader>{'Journey from ' + trip.origin_stop_name + ' to ' + trip.destination_stop_name}</ListSubheader>
                        <ListItem>
                            <ListItemText primary={estimated_duration} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={scheduled_duration} />
                        </ListItem>
                    </List>
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