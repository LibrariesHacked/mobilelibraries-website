import React, { useState, useEffect, useRef } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import ListSubheader from '@material-ui/core/ListSubheader'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'

import { fade } from '@material-ui/core/styles/colorManipulator'
import { makeStyles } from '@material-ui/core/styles'

import ClearIcon from '@material-ui/icons/ClearTwoTone'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import SettingsIcon from '@material-ui/icons/SettingsTwoTone'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as geoHelper from './helpers/geo'
import * as mobilesModel from './models/mobiles'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  },
  iconButton: {
    padding: theme.spacing()
  },
  iconProgress: {
    margin: theme.spacing()
  },
  inputInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(2),
    fontWeight: theme.typography.fontWeightBold
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
  const { settings } = props
  const [{ }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ searchType, searchPostcode, searchDistance }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ loadingPostcode }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [tempPostcode, setTempPostcode] = useState(searchPostcode)
  const [anchor, setAnchor] = useState(null)

  const prevProps = usePrevious({ searchPostcode })
  useEffect(() => {
    if (prevProps && searchPostcode !== prevProps.searchPostcode) setTempPostcode(searchPostcode)
  }, [searchPostcode]) // eslint-disable-line

  const openSettingsMenu = (e) => setAnchor(e.currentTarget)

  const closeSettingsMenu = () => setAnchor(null)

  const setSearchDistance = (searchDistance) => {
    closeSettingsMenu()
    dispatchSearch({ type: 'SetSearchDistance', searchDistance: searchDistance })
    if (searchType === 'postcode') postcodeSearch()
  }

  const postcodeSearch = async () => {
    dispatchView({ type: 'ToggleLoadingPostcode' })
    const validatePostcode = (pc) => /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(pc)
    if (tempPostcode !== '' && validatePostcode(tempPostcode.trim())) {
      const postcodeData = await geoHelper.getPostcode(tempPostcode)
      if (postcodeData.location && postcodeData.location.length === 2) {
        dispatchSearch({ type: 'SetPostcodeSearch', searchPostcode: tempPostcode, searchPosition: postcodeData.location })
        dispatchView({ type: 'SetPostcodeSearch', mapPosition: postcodeData.location })
        const mobilesNearest = await mobilesModel.getMobilesNearest(postcodeData.location, searchDistance)
        const mobilesNearestLookup = {}
        mobilesNearest.forEach(mobile => { mobilesNearestLookup[mobile.mobileId] = mobile })
        dispatchApplication({ type: 'UpdateMobilesNearest', mobilesNearest: mobilesNearest, mobilesNearestLookup: mobilesNearestLookup })
      } else {
        dispatchView({ type: 'ShowNotification', notificationMessage: 'Could not find that postcode' })
      }
    } else {
      dispatchView({ type: 'ShowNotification', notificationMessage: 'You must enter a valid postcode' })
    }
    dispatchView({ type: 'ToggleLoadingPostcode' })
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
        onChange={(e) => setTempPostcode(e.target.value.toUpperCase())}
        onKeyDown={(e) => { if (e.keyCode === 13) postcodeSearch() }}
      />
      <div className={classes.grow} />
      {searchType === 'postcode'
        ? (
          <Tooltip title='Clear search'>
            <IconButton
              aria-label='Clear search'
              className={classes.iconButton}
              onClick={() => dispatchSearch({ type: 'ClearAll' })}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )
        : null}
      <Tooltip title='Search by postcode'>
        {!loadingPostcode
          ? (
            <IconButton
              aria-label='Search'
              color='primary'
              className={classes.iconButton}
              onClick={() => postcodeSearch()}
            >
              <SearchIcon />
            </IconButton>
          ) : <CircularProgress size={22} className={classes.iconProgress} />}
      </Tooltip>
      {settings
        ? (
          <Tooltip title='Change search settings'>
            <IconButton
              aria-label='Open search settings menu'
              className={classes.iconButton}
              color='secondary'
              onClick={(e) => { openSettingsMenu(e) }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      <Menu
        id='mnu-settings'
        anchorEl={anchor}
        keepMounted
        open={Boolean(anchor)}
        onClose={() => closeSettingsMenu()}
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
