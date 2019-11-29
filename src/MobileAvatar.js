// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

// MUI Icons
import DirectionBusIcon from '@material-ui/icons/DirectionsBus';

// Material UI Styles
import { withStyles } from '@material-ui/core/styles';

// Helpers
import * as mobilesHelper from './helpers/mobiles';
import * as utilsHelper from './helpers/utils';

const styles = theme => ({
    fab: {
        margin: theme.spacing(1),
        boxShadow: 'none'
    }
});

class MobileAvatar extends Component {

    render() {
        const { classes, location, organisation, zoom } = this.props;
        const status = mobilesHelper.getMobileStatus(location);
        const size = (zoom < 8 ? "small" : (zoom < 12 ? "medium" : "large"));
        const border = (zoom < 8 ? 2 : (zoom < 12 ? 3 : 4));
        return (
            <Tooltip
                title={(status ? status.text_format : '')}>
                <Fab 
                    size={size}
                    className={classes.fab}
                    color="primary"
                    style={{
                        backgroundColor: utilsHelper.hextoRGBA(organisation.colour, 0.8),
                        border: (border + 'px solid #FFFFFF')
                    }}
                >
                    <DirectionBusIcon />
                </Fab>
            </Tooltip >
        );
    }
}

MobileAvatar.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MobileAvatar);