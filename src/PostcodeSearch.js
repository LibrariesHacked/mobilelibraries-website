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

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

// Our helpers
import * as geoHelper from './helpers/geo'
import * as mobilesModel from './models/mobiles'

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

function PostcodeSearch () {
  const [{ }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ searchType, searchPostcode }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [tempPostcode, setTempPostcode] = useState(searchPostcode)
  const [anchor, setAnchor] = useState(null)

  const prevProps = usePrevious({ searchPostcode })
  useEffect(() => {
    if (prevProps && searchPostcode !== prevProps.searchPostcode) setTempPostcode(searchPostcode)
  }, [searchPostcode]) // eslint-disable-line

  const openSettingsMenu = (e) => setAnchor(e.currentTarget)

  const closeSettingsMenu = () => setAnchor(null)

  const setSearchDistance = (distance) => {
    closeSettingsMenu()
    dispatchSearch('SetSearchDistance', { searchDistance: distance })
  }

  const postcodeSearch = async () => {
    if (tempPostcode === '') {
      dispatchView('ShowNotification', { notificationMessage: 'You must enter a postcode' })
      return
    }

    dispatchView('LoadingPostcode')
    const postcodeData = await geoHelper.getPostcode(tempPostcode)
    if (postcodeData.location && postcodeData.location.length === 2) {
      dispatchSearch('SetPostcodeSearch', { searchPostcode: tempPostcode, searchPosition: postcodeData.location })
      dispatchView('SetPostcodeSearch')
      const mobilesNearest = await mobilesModel.getMobilesNearest(postcodeData.location)
      const mobilesNearestLookup = {}
      mobilesNearest.forEach(mobile => { mobilesNearestLookup[mobile.id] = mobile })
      dispatchApplication({ type: 'UpdateMobilesNearest', mobilesNearest: mobilesNearest, mobilesNearestLookup: mobilesNearestLookup })
    } else {
      dispatchView('ShowNotification', { notificationMessage: 'Could not find postcode' })
    }
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
              onClick={() => dispatchSearch('ClearPostcodeSearch')}
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
          onClick={() => postcodeSearch()}
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
