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

});

class ResponsiveDialog extends React.Component {
    state = {}

    close = () => { this.props.close() }

    render() {
        const { width } = this.props;
        const fullScreen = isWidthDown('sm', width);
        return (
            <Dialog
                fullScreen={fullScreen}
                open={this.props.open}
                onClose={this.close}
                aria-labelledby="responsive-dialog-title"
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