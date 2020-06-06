import React, { useState, useEffect, useRef } from 'react'

// Material UI
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import ListSubheader from '@material-ui/core/ListSubheader'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'

// Material UI Styles
import { fade } from '@material-ui/core/styles/colorManipulator'
import { makeStyles } from '@material-ui/core/styles'

// Material icons
import ClearIcon from '@material-ui/icons/ClearTwoTone'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import SettingsIcon from '@material-ui/icons/SettingsTwoTone'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  },
  iconButton: {
    padding: 10
  },
  inputInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(2),
    fontWeight: 500
  },
  search: {
    position: 'relative',
    border: '1px solid #E0E0E0',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.8),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.9)
    },
    marginLeft: 0,
    marginRight: theme.spacing(),
    display: 'flex',
    maxWidth: 240
  }
}))

function usePrevious (value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function PostcodeSearch (props) {
  const { searchType, postcodeSearch, clearSearch, postcode, setDistance } = props

  const [tempPostcode, setTempPostcode] = useState(postcode)
  const [anchor, setAnchor] = useState(null)

  const prevProps = usePrevious({ postcode })
  useEffect(() => {
    if (prevProps && postcode !== prevProps.postcode) setTempPostcode(postcode)
  }, [postcode]) // eslint-disable-line

  const openSettingsMenu = (e) => setAnchor(e.currentTarget)

  const closeSettingsMenu = () => setAnchor(null)

  const setSearchDistance = (distance) => {
    closeSettingsMenu()
    setDistance(distance)
  }

  const classes = useStyles()

  return (
    <div className={classes.search}>
      <InputBase
        placeholder='Postcode'
        classes={{
          input: classes.inputInput
        }}
        value={tempPostcode}
        onChange={(e) => setTempPostcode(e.target.value)}
      />
      <div className={classes.grow} />
      {searchType === 'postcode'
        ? (
          <Tooltip title='Clear search'>
            <IconButton
              className={classes.iconButton}
              onClick={() => clearSearch()}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )
        : null}
      <Tooltip title='Search by postcode'>
        <IconButton
          color='primary'
          className={classes.iconButton}
          onClick={() => postcodeSearch(tempPostcode)}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Change search settings'>
        <IconButton
          className={classes.iconButton}
          color='secondary'
          onClick={(e) => { openSettingsMenu(e) }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id='mnu-settings'
        anchorEl={anchor}
        keepMounted
        open={Boolean(anchor)}
        onClose={() => this.closeSettingsMenu()}
      >
        <ListSubheader disableSticky>Search distance</ListSubheader>
        <MenuItem onClick={() => setSearchDistance(1609)}>1 mile</MenuItem>
        <MenuItem onClick={() => setSearchDistance(4827)}>3 miles</MenuItem>
        <MenuItem onClick={() => setSearchDistance(8045)}>5 miles</MenuItem>
        <MenuItem onClick={() => setSearchDistance(16090)}>10 miles</MenuItem>
        <MenuItem onClick={() => setSearchDistance(32180)}>20 miles</MenuItem>
        <MenuItem onClick={() => setSearchDistance(80450)}>50 miles</MenuItem>
      </Menu>
    </div>
  )
}

export default PostcodeSearch
