// React and additional
import React from 'react'
import PropTypes from 'prop-types'

// Material UI
import Avatar from '@material-ui/core/Avatar'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

// Icons
import Face from '@material-ui/icons/FaceTwoTone'

const styles = theme => ({
  avatar: {
    margin: 0
  },
  avatarOn: {
    margin: 0,
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.main
  }
})

class MeAvatar extends React.Component {
  render () {
    const { classes } = this.props

    return (
      <Tooltip title='Me'>
        <Avatar
          className={this.props.searchType === 'gps' ? classes.avatarOn : classes.avatar}
        >
          <Face />
        </Avatar>
      </Tooltip>
    )
  }
}

MeAvatar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MeAvatar)
