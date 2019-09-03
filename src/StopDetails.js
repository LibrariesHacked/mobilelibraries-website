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

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

// Moment
import moment from 'moment';

const config = require('./helpers/config.json');

const styles = theme => ({
    dialog: {
        border: '1px solid #F5F5F5'
    },
    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class ResponsiveDialog extends React.Component {
    state = {}

    getStopCalendar = (e, row) => window.open(config.api + '/stops/' + row.id + '/ics');
	getStopPdf = (e, row) => window.open(config.api + '/stops/' + row.id + '/pdf', '_blank');

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
                <DialogTitle id="responsive-dialog-title">{stop.name}</DialogTitle>
                <DialogContent>
                    <List className={classes.list}>
                        <ListItem>
                            <ListItemText primary="Address" secondary={stop.address} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Time" secondary={moment(stop.arrival, 'HH:mm:ssZ').format('h:mma') + ' - ' + moment(stop.departure, 'HH:mm:ssZ').format('h:mma')} />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.close()} color="primary">Add to calendar</Button>
                    <Button onClick={() => this.close()} color="primary">Download PDF</Button>
                    <Button onClick={() => this.close()} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

ResponsiveDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withWidth(), withStyles(styles, { withTheme: true }))(ResponsiveDialog);