import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    dialog: {
        border: '1px solid #e5e5e5'
    }
});

class MapSettings extends React.Component {
    state = {}

    handleAuthorityBoundaryChange = () => {
        this.props.toggleMapSetting('authority_boundary');
    }

    close = () => this.props.close()

    render() {
        const { classes, width, map_settings } = this.props;
        const fullScreen = isWidthDown('sm', width);
        return (
            <Dialog
                fullScreen={fullScreen}
                disableBackdropClick={true}
                open={this.props.open}
                onClose={this.close}
                BackdropProps={{
                    invisible: true
                }}
                PaperProps={
                    {
                        elevation: 0,
                        className: classes.dialog
                    }
                }
            >
                <DialogTitle>Map settings</DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={map_settings.authority_boundary}
                                onChange={this.handleAuthorityBoundaryChange}
                                name="sw_authority_boundary"
                                color="primary"
                            />
                        }
                        label="Authority boundaries"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.close()} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

MapSettings.propTypes = {
    classes: PropTypes.object.isRequired
};

export default compose(withWidth(), withStyles(styles, { withTheme: true }))(MapSettings);