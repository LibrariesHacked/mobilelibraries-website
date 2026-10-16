import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'

import ClearIcon from '@mui/icons-material/ClearRounded'
import SearchIcon from '@mui/icons-material/SearchRounded'
import GpsFixedIcon from '@mui/icons-material/GpsFixedRounded'
import GpsNotFixedIcon from '@mui/icons-material/GpsNotFixedRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import usePrevious from './hooks/usePrevious'
import * as geoHelper from './helpers/geo'
import * as urlHelper from './helpers/url'
import { createLookup } from './helpers/utils'
import * as mobilesModel from './models/mobiles'

/**
 * Inline wrapper for loading spinner indicators inside the search bar.
 * @param {{ children: React.ReactNode }} props - Component props.
 * @returns {JSX.Element} SearchBox element.
 */
const SearchBox = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        minWidth: 44,
        minHeight: 44,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {children}
    </Box>
  )
}

/**
 * Postcode and geolocation search input bar.
 * @returns {JSX.Element} PostcodeSearch component.
 */
const PostcodeSearch = () => {
  const [{}, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [
    { searchType, searchPostcode, searchPosition, searchDistance },
    dispatchSearch
  ] = useSearchStateValue() //eslint-disable-line
  const [{ loadingPostcode, loadingLocation, locationLoaded }, dispatchView] =
    useViewStateValue() //eslint-disable-line

  const [tempPostcode, setTempPostcode] = useState(searchPostcode || '')

  const prevProps = usePrevious({ searchPostcode })

  const navigate = useNavigate()

  useEffect(() => {
    if (prevProps && searchPostcode !== prevProps.searchPostcode) {
      setTempPostcode(searchPostcode)
    }
  }, [searchPostcode, prevProps])

  const updateNearestMobiles = async location => {
    const mobilesNearest = await mobilesModel.getMobilesNearest(
      location,
      searchDistance
    )
    dispatchApplication({
      type: 'UpdateMobilesNearest',
      mobilesNearest,
      mobilesNearestLookup: createLookup(mobilesNearest, 'mobileId')
    })
  }

  const getLocation = async () => {
    if (!loadingLocation) {
      dispatchView({ type: 'ToggleLoadingLocation' })
      try {
        const pos =
          searchPosition.length > 0
            ? searchPosition
            : await geoHelper.getCurrentPosition()
        dispatchSearch({ type: 'SetLocation', searchPosition: pos })
        dispatchView({
          type: 'FlyTo',
          mapFlyToPosition: pos,
          mapZoom: 14
        })
        await Promise.all([
          updateNearestMobiles(pos),
          getLocationPostcode(pos)
        ])
        dispatchView({ type: 'SetLocationLoaded' })
        dispatchView({ type: 'ToggleLoadingLocation' })
      } catch (err) {
        dispatchView({ type: 'ToggleLoadingLocation' })
        dispatchView({
          type: 'ShowNotification',
          notificationMessage: 'Could not determine your current location',
          notificationSeverity: 'error'
        })
      }
    }
  }

  const getLocationPostcode = async location => {
    if (location.length > 0) {
      const postcode = await geoHelper.getCurrentPostcode(...location)
      setTempPostcode(postcode)
      return postcode
    }
  }

  const clearSearch = () => {
    setTempPostcode('')
    dispatchSearch({ type: 'ClearAll' })
    dispatchApplication({
      type: 'UpdateMobilesNearest',
      mobilesNearest: [],
      mobilesNearestLookup: {}
    })
    urlHelper.clearService(navigate)
  }

  const postcodeSearch = async (postcode = tempPostcode) => {
    if (!postcode || postcode === '') {
      dispatchView({
        type: 'ShowNotification',
        notificationMessage: 'Please enter a postcode before searching',
        notificationSeverity: 'warning'
      })
      return
    }
    dispatchView({ type: 'ToggleLoadingPostcode' })
    if (geoHelper.validatePostcode(postcode)) {
      const service = await geoHelper.getPostcode(postcode.trim())
      if (service && service.location && service.location.length > 0) {
        await updateNearestMobiles(service.location)
        dispatchSearch({
          type: 'SetPostcodeSearch',
          searchPostcode: postcode,
          searchPosition: service.location
        })
        dispatchView({
          type: 'FlyTo',
          mapFlyToPosition: service.location,
          mapZoom: 14
        })
      } else {
        dispatchView({
          type: 'ShowNotification',
          notificationMessage: "We couldn't find that postcode",
          notificationSeverity: 'error'
        })
      }
    } else {
      dispatchView({
        type: 'ShowNotification',
        notificationMessage: "We couldn't find that postcode",
        notificationSeverity: 'error'
      })
    }
    dispatchView({ type: 'ToggleLoadingPostcode' })
  }

  return (
    <Paper
      component='form'
      role='search'
      aria-label='Find a mobile library'
      onSubmit={e => {
        e.preventDefault()
        postcodeSearch()
      }}
      variant='outlined'
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        pl: 2,
        pr: 0.75,
        py: 0.5
      }}
    >
      <InputBase
        placeholder='Enter postcode'
        value={tempPostcode}
        onChange={e => setTempPostcode(e.target.value.toUpperCase())}
        inputProps={{ 'aria-label': 'Search by postcode' }}
        sx={{
          width: 140,
          fontWeight: 500
        }}
      />
      {!loadingPostcode
        ? (
          <Tooltip title='Search by postcode' describeChild>
            <IconButton
              aria-label='Search by postcode'
              onClick={() => postcodeSearch()}
              disabled={loadingPostcode || loadingLocation}
            >
              <SearchIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          )
        : (
          <SearchBox>
            <CircularProgress
              size={20}
              aria-label='Searching for postcode'
            />
          </SearchBox>
          )}
      {!loadingLocation
        ? (
          <Tooltip title='Use your current location' describeChild>
            <IconButton
              aria-label='Use your current location'
              onClick={() => getLocation()}
              disabled={loadingPostcode || loadingLocation}
            >
              {locationLoaded
                ? (
                  <GpsFixedIcon fontSize='small' />
                  )
                : (
                  <GpsNotFixedIcon fontSize='small' />
                  )}
            </IconButton>
          </Tooltip>
          )
        : (
          <SearchBox>
            <CircularProgress
              size={20}
              aria-label='Getting your location'
            />
          </SearchBox>
          )}
      {searchType === 'postcode' || searchType === 'gps'
        ? (
          <Tooltip title='Clear search' describeChild>
            <IconButton
              color='secondary'
              aria-label='Clear search'
              onClick={() => clearSearch()}
              disabled={loadingPostcode || loadingLocation}
            >
              <ClearIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          )
        : null}
    </Paper>
  )
}

export default PostcodeSearch
