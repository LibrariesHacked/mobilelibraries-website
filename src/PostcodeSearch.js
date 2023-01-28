import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import ListSubheader from '@mui/material/ListSubheader'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import { alpha } from '@mui/material/styles'

import makeStyles from '@mui/styles/makeStyles'

import ClearIcon from '@mui/icons-material/ClearTwoTone'
import MyLocationIcon from '@mui/icons-material/MyLocationTwoTone'
import SearchIcon from '@mui/icons-material/SearchTwoTone'
import SettingsIcon from '@mui/icons-material/SettingsTwoTone'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as geoHelper from './helpers/geo'
import * as urlHelper from './helpers/url'
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
    borderColor: theme.palette.outline.main,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.9)
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
  const [{ organisations }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ searchType, searchPostcode, searchDistance, searchPosition }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ loadingPostcode, loadingLocation }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [tempPostcode, setTempPostcode] = useState(searchPostcode || '')
  const [anchor, setAnchor] = useState(null)

  const prevProps = usePrevious({ searchPostcode })

  useEffect(() => {
    if (prevProps && searchPostcode !== prevProps.searchPostcode) setTempPostcode(searchPostcode)
  }, [searchPostcode, prevProps])

  const getLocation = async () => {
    if (!loadingLocation) {
      dispatchView({ type: 'ToggleLoadingLocation' })
      const pos = (searchPosition.length > 0 ? searchPosition : (await geoHelper.getCurrentPosition()))
      dispatchSearch({ type: 'SetLocation', searchPosition: pos })
      const postcode = await getLocationPostcode(pos)
      dispatchView({ type: 'ToggleLoadingLocation' })
      if (postcode && postcode !== '') postcodeSearch(postcode)
    }
  }

  const getLocationPostcode = async (location) => {
    if (location.length > 0) {
      const postcode = await geoHelper.getCurrentPostcode(...location)
      setTempPostcode(postcode)
      return postcode
    }
  }

  const openSettingsMenu = (e) => setAnchor(e.currentTarget)

  const closeSettingsMenu = () => setAnchor(null)

  const setSearchDistance = (searchDistance) => {
    closeSettingsMenu()
    dispatchSearch({ type: 'SetSearchDistance', searchDistance: searchDistance })
    if (searchType === 'postcode') postcodeSearch(tempPostcode)
  }

  const clearSearch = () => {
    setTempPostcode('')
    dispatchSearch({ type: 'ClearAll' })
    urlHelper.clearService(props.history)
  }

  const postcodeSearch = async (postcode = tempPostcode) => {
    if (!postcode || postcode === '') {
      dispatchView({ type: 'ShowNotification', notificationMessage: 'Please enter a postcode before searching', notificationSeverity: 'warning' })
      return
    }
    dispatchView({ type: 'ToggleLoadingPostcode' })
    dispatchView({ type: 'LoadingPostcode' })
    if (geoHelper.validatePostcode(postcode)) {
      const service = await geoHelper.getServiceDataFromPostcode(postcode.trim(), organisations)
      dispatchSearch({ type: 'SetPostcodeSearch', searchPostcode: postcode, searchPosition: service.location })
      dispatchSearch({ type: 'SetService', service: service.service })
      const mobilesNearest = await mobilesModel.getMobilesNearest(service.location, searchDistance)
      const mobilesNearestLookup = {}
      mobilesNearest.forEach(mobile => { mobilesNearestLookup[mobile.mobileId] = mobile })
      dispatchApplication({ type: 'UpdateMobilesNearest', mobilesNearest: mobilesNearest, mobilesNearestLookup: mobilesNearestLookup })
      urlHelper.addService(props.history, service.service.systemName)
    } else {
      dispatchView({ type: 'ShowNotification', notificationMessage: 'We could not find that postcode', notificationSeverity: 'error' })
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
        inputProps={{ 'aria-label': 'search by postcode' }}
      />
      {searchType === 'postcode'
        ? (
          <Tooltip title='Clear search'>
            <IconButton
              aria-label='Clear search'
              className={classes.iconButton}
              onClick={() => clearSearch()}
              size='large'
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
          )
        : null}
      <div className={classes.grow} />
      <Tooltip title='Search by postcode'>
        {!loadingPostcode
          ? (
            <IconButton
              aria-label='Search'
              color='primary'
              className={classes.iconButton}
              onClick={() => postcodeSearch()}
              size='large'
            >
              <SearchIcon />
            </IconButton>
            )
          : <Box position='relative' display='inline-flex' className={classes.iconProgress}><CircularProgress size={22} /></Box>}
      </Tooltip>
      <Divider orientation='vertical' flexItem />
      <Tooltip title='Use your current location'>
        {!loadingLocation
          ? (
            <IconButton
              aria-label='Search by current location'
              color='primary'
              className={classes.iconButton}
              onClick={() => getLocation()}
              size='large'
            >
              <MyLocationIcon />
            </IconButton>
            )
          : <Box position='relative' display='inline-flex' className={classes.iconProgress}><CircularProgress size={22} /></Box>}
      </Tooltip>
      {settings
        ? (
          <Tooltip title='Change search settings'>
            <IconButton
              aria-label='Open search settings menu'
              className={classes.iconButton}
              color='secondary'
              onClick={(e) => { openSettingsMenu(e) }}
              size='large'
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          )
        : null}
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

export default withRouter(PostcodeSearch)
