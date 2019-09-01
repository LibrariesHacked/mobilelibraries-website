import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	dialog: {
		border: '1px solid #F5F5F5'
	}
});

class ResponsiveDialog extends React.Component {
    state = {}

    close = () => { this.props.close() }

    render() {
        const { classes, width } = this.props;
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
                <DialogTitle id="responsive-dialog-title">{"Stop details"}</DialogTitle>
                <DialogContent>
                    <DialogContentText></DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.close()} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

ResponsiveDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withWidth(), withStyles(styles, { withTheme: true }))(ResponsiveDialog);