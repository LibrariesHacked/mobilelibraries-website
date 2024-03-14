import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Tooltip from '@mui/material/Tooltip'

import { alpha, lighten } from '@mui/material/styles'

import ClearIcon from '@mui/icons-material/ClearRounded'
import MyLocationIcon from '@mui/icons-material/MyLocationRounded'
import SearchIcon from '@mui/icons-material/SearchRounded'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as geoHelper from './helpers/geo'
import * as urlHelper from './helpers/url'

const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const SearchBox = ({ children }) => {
  return (
    <Box
      position='relative'
      display='inline-flex'
      sx={{
        padding: theme => theme.spacing(1),
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </Box>
  )
}

const PostcodeSearch = () => {
  const [{ searchType, searchPostcode, searchPosition }, dispatchSearch] =
    useSearchStateValue() //eslint-disable-line
  const [{ loadingPostcode, loadingLocation }, dispatchView] =
    useViewStateValue() //eslint-disable-line

  const [tempPostcode, setTempPostcode] = useState(searchPostcode || '')

  const prevProps = usePrevious({ searchPostcode })

  const navigate = useNavigate()

  useEffect(() => {
    if (prevProps && searchPostcode !== prevProps.searchPostcode) {
      setTempPostcode(searchPostcode)
    }
  }, [searchPostcode, prevProps])

  const getLocation = async () => {
    if (!loadingLocation) {
      dispatchView({ type: 'ToggleLoadingLocation' })
      const pos =
        searchPosition.length > 0
          ? searchPosition
          : await geoHelper.getCurrentPosition()
      dispatchSearch({ type: 'SetLocation', searchPosition: pos })
      const postcode = await getLocationPostcode(pos)
      dispatchView({ type: 'SetLocationLoaded' })
      dispatchView({ type: 'ToggleLoadingLocation' })
      if (postcode && postcode !== '') postcodeSearch(postcode)
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
    dispatchView({ type: 'LoadingPostcode' })
    if (geoHelper.validatePostcode(postcode)) {
      const service = await geoHelper.getPostcode(postcode.trim())
      if (service && service.location && service.location.length > 0) {
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
    <Box
      sx={{
        position: 'relative',
        backgroundColor: theme => alpha(theme.palette.primary.main, 0.05),
        marginLeft: 0,
        paddingLeft: 0,
        whitespace: 'nowrap',
        display: 'inline-flex',
        color: theme => theme.palette.primary.main,
        borderRadius: '6px',
        border: theme => `2px solid ${lighten(theme.palette.primary.main, 0.5)}`
      }}
    >
      <InputBase
        placeholder='Postcode'
        value={tempPostcode}
        onChange={e => setTempPostcode(e.target.value.toUpperCase())}
        onKeyDown={e => {
          if (e.key === 'Enter') postcodeSearch()
        }}
        inputProps={{ 'aria-label': 'search by postcode' }}
        sx={{
          paddingLeft: theme => theme.spacing(2),
          maxWidth: 110,
          color: theme => theme.palette.secondary.main,
          fontWeight: 700
        }}
      />
      {!loadingPostcode && !loadingLocation ? (
        <Tooltip title='Search by postcode'>
          <IconButton
            aria-label='Search'
            color='inherit'
            onClick={() => postcodeSearch()}
            size='large'
            disabled={loadingPostcode || loadingLocation}
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <SearchBox>
          <CircularProgress color='inherit' size={22} />
        </SearchBox>
      )}
      <Tooltip title='Use your current location'>
        <>
          {!loadingLocation && !loadingPostcode ? (
            <IconButton
              aria-label='Search by current location'
              color='inherit'
              onClick={() => getLocation()}
              size='large'
              disabled={loadingPostcode || loadingLocation}
            >
              <MyLocationIcon />
            </IconButton>
          ) : (
            <SearchBox>
              <CircularProgress color='inherit' size={22} />
            </SearchBox>
          )}
        </>
      </Tooltip>
      {searchType === 'postcode' ? (
        <Tooltip title='Clear search'>
          <IconButton
            color='inherit'
            aria-label='Clear search'
            onClick={() => clearSearch()}
            size='large'
            disabled={loadingPostcode || loadingLocation}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Box>
  )
}

export default PostcodeSearch
