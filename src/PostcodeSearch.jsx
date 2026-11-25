import React, { useState, useEffect, useRef } from 'react'
import { createNameIndex, dataAttribution } from '@geovation/gb-name-index'

import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import ClearIcon from '@mui/icons-material/CloseRounded'
import SearchIcon from '@mui/icons-material/SearchRounded'
import MyLocationIcon from '@mui/icons-material/MyLocationRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import ExternalLink from './ExternalLink'
import * as geoHelper from './helpers/geo'
import { createLookup } from './helpers/utils'
import * as mobilesModel from './models/mobiles'

let nameIndexInstance = null
const getNameIndex = () => {
  if (!nameIndexInstance) {
    nameIndexInstance = createNameIndex()
  }
  return nameIndexInstance
}

/**
 * Full-width place and postcode search bar powered by `@geovation/gb-name-index`,
 * UK postcode lookup, and browser GPS geolocation.
 *
 * @returns {JSX.Element} PostcodeSearch component.
 */
const PostcodeSearch = () => {
  const [, dispatchApplication] = useApplicationStateValue()
  const [
    { searchType, searchPostcode, searchPosition, searchDistance },
    dispatchSearch
  ] = useSearchStateValue()
  const [{ loadingPostcode, loadingLocation, locationLoaded }, dispatchView] =
    useViewStateValue()

  const [query, setQuery] = useState(searchPostcode || '')
  const [suggestions, setSuggestions] = useState([])
  const [moreAvailable, setMoreAvailable] = useState(false)
  const [loadingPlaces, setLoadingPlaces] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const abortRef = useRef(null)
  const timerRef = useRef(null)
  const selectedLabelRef = useRef(searchPostcode || '')

  useEffect(() => {
    selectedLabelRef.current = searchPostcode || ''
    setQuery(searchPostcode || '')
  }, [searchPostcode])

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current)
      abortRef.current?.abort()
    }
  }, [])

  const closeDropdown = () => {
    clearTimeout(timerRef.current)
    abortRef.current?.abort()
    setDropdownOpen(false)
    setActiveIndex(-1)
  }

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

  const applySearchLocation = async (label, coords) => {
    closeDropdown()
    selectedLabelRef.current = label
    setQuery(label)
    await updateNearestMobiles(coords)
    dispatchSearch({
      type: 'SetPostcodeSearch',
      searchPostcode: label,
      searchPosition: coords
    })
    dispatchView({
      type: 'FlyTo',
      mapFlyToPosition: coords,
      mapZoom: 13
    })
  }

  const lookupPlaces = async rawValue => {
    const trimmed = rawValue.trim()
    const alnum = trimmed.replace(/[^a-z0-9]/gi, '')
    if (
      alnum.length < 3 ||
      trimmed === selectedLabelRef.current ||
      geoHelper.validatePostcode(trimmed)
    ) {
      setSuggestions([])
      setDropdownOpen(false)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoadingPlaces(true)

    try {
      const index = getNameIndex()
      const places = await index.search(trimmed, {
        signal: controller.signal,
        previewLimit: 8
      })
      if (controller.signal.aborted) return

      const located = places
        .filter(
          p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude)
        )
        .slice(0, 8)
        .map(place => {
          const label = [
            ...new Set(
              [place.name, place.locality, place.region].filter(Boolean)
            )
          ].join(', ')
          return {
            label,
            longitude: place.longitude,
            latitude: place.latitude
          }
        })

      setSuggestions(located)
      setMoreAvailable(Boolean(places.moreAvailable))
      setDropdownOpen(true)
      setActiveIndex(-1)
    } catch (e) {
      if (!controller.signal.aborted) {
        setSuggestions([])
        setDropdownOpen(false)
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingPlaces(false)
      }
    }
  }

  const handleInputChange = e => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => lookupPlaces(val), 220)
  }

  const getLocation = async () => {
    if (loadingLocation) return
    closeDropdown()
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
      const [, postcode] = await Promise.all([
        updateNearestMobiles(pos),
        geoHelper.getCurrentPostcode(...pos)
      ])
      const label = postcode || 'Current location'
      selectedLabelRef.current = label
      setQuery(label)
      dispatchView({ type: 'SetLocationLoaded' })
    } catch (err) {
      dispatchView({
        type: 'ShowNotification',
        notificationMessage: 'Could not determine your current location'
      })
    } finally {
      dispatchView({ type: 'ToggleLoadingLocation' })
    }
  }

  const clearSearch = () => {
    closeDropdown()
    selectedLabelRef.current = ''
    setQuery('')
    setSuggestions([])
    dispatchSearch({ type: 'ClearAll' })
    dispatchApplication({
      type: 'UpdateMobilesNearest',
      mobilesNearest: [],
      mobilesNearestLookup: {}
    })
  }

  const handleSubmit = async () => {
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      const item = suggestions[activeIndex]
      await applySearchLocation(item.label, [item.longitude, item.latitude])
      return
    }

    const trimmed = query ? query.trim() : ''
    if (!trimmed) {
      dispatchView({
        type: 'ShowNotification',
        notificationMessage: 'Please enter a place or postcode before searching'
      })
      return
    }

    if (geoHelper.validatePostcode(trimmed)) {
      closeDropdown()
      dispatchView({ type: 'ToggleLoadingPostcode' })
      try {
        const upper = trimmed.toUpperCase()
        const service = await geoHelper.getPostcode(upper)
        if (!service?.location?.length) {
          throw new Error('Postcode not found')
        }
        await applySearchLocation(upper, service.location)
      } catch (e) {
        dispatchView({
          type: 'ShowNotification',
          notificationMessage: "We couldn't find that postcode"
        })
      } finally {
        dispatchView({ type: 'ToggleLoadingPostcode' })
      }
      return
    }

    if (suggestions.length > 0) {
      const first = suggestions[0]
      await applySearchLocation(first.label, [first.longitude, first.latitude])
      return
    }

    dispatchView({ type: 'ToggleLoadingPostcode' })
    try {
      const index = getNameIndex()
      const places = await index.search(trimmed, { previewLimit: 5 })
      const first = places.find(
        p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude)
      )
      if (!first) throw new Error('Place not found')
      const label = [
        ...new Set([first.name, first.locality, first.region].filter(Boolean))
      ].join(', ')
      await applySearchLocation(label, [first.longitude, first.latitude])
    } catch (e) {
      dispatchView({
        type: 'ShowNotification',
        notificationMessage: "We couldn't find a matching place or postcode"
      })
    } finally {
      dispatchView({ type: 'ToggleLoadingPostcode' })
    }
  }

  const handleKeyDown = e => {
    if (!dropdownOpen || suggestions.length === 0) {
      if (e.key === 'Escape') closeDropdown()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => (prev + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1))
    } else if (e.key === 'Escape') {
      closeDropdown()
    }
  }

  const isBusy = loadingPostcode || loadingLocation

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Paper
        component='form'
        role='search'
        aria-label='Find a mobile library by place or postcode'
        onSubmit={e => {
          e.preventDefault()
          handleSubmit()
        }}
        sx={theme => ({
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: 0.75,
          p: 0.75,
          borderRadius: 1,
          backgroundColor: theme.palette.background.paper,
          border: theme.custom.outline,
          transition: 'border-color 0.15s ease',
          '&:hover': {
            border: theme.custom.outlineHover
          },
          '&:focus-within': {
            border: theme.custom.outlineFocus
          }
        })}
      >
        <Box sx={theme => theme.custom.iconBadge}>
          {loadingPostcode || loadingPlaces
            ? <CircularProgress size={18} color='inherit' />
            : <SearchIcon sx={{ fontSize: '1.25rem' }} />}
        </Box>

        <InputBase
          placeholder='Search town, village, or postcode…'
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(closeDropdown, 150)}
          inputProps={{
            'aria-label': 'Search by town, village, or postcode',
            'aria-expanded': dropdownOpen,
            'aria-controls': 'gb-places-listbox',
            autoComplete: 'off'
          }}
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            fontSize: '0.925rem'
          }}
        />

        {(query || searchType === 'postcode' || searchType === 'gps') && (
          <Tooltip title='Clear search' describeChild>
            <IconButton
              size='small'
              aria-label='Clear search'
              onClick={clearSearch}
              disabled={isBusy}
              sx={{ width: 32, height: 32 }}
            >
              <ClearIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title='Use your current location' describeChild>
          <span>
            <IconButton
              size='small'
              aria-label='Use your current location'
              onClick={getLocation}
              disabled={isBusy}
              sx={theme => ({
                width: 32,
                height: 32,
                backgroundColor: locationLoaded
                  ? alpha(theme.palette.primary.main, 0.2)
                  : alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.22)
                }
              })}
            >
              {loadingLocation
                ? <CircularProgress size={18} color='inherit' />
                : <MyLocationIcon sx={{ fontSize: '1.2rem' }} />}
            </IconButton>
          </span>
        </Tooltip>
      </Paper>

      {dropdownOpen && (
        <Paper
          sx={theme => ({
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 30,
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 8px 24px ${alpha(theme.palette.text.primary, 0.14)}`,
            overflow: 'hidden'
          })}
        >
          {suggestions.length > 0
            ? (
              <>
                <Typography
                  variant='caption'
                  sx={{
                    display: 'block',
                    px: 2,
                    pt: 1.25,
                    pb: 0.5,
                    color: 'text.secondary'
                  }}
                >
                  {moreAvailable
                    ? 'Matching places (keep typing to narrow results)'
                    : 'Matching places'}
                </Typography>
                <List
                  id='gb-places-listbox'
                  role='listbox'
                  dense
                  disablePadding
                  sx={{ maxHeight: 250, overflowY: 'auto', px: 0.75, pb: 0.5 }}
                >
                  {suggestions.map((item, idx) => (
                    <ListItemButton
                      key={`${item.label}_${idx}`}
                      role='option'
                      selected={idx === activeIndex}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() =>
                        applySearchLocation(item.label, [
                          item.longitude,
                          item.latitude
                        ])}
                      sx={theme => ({
                        borderRadius: 1,
                        '&:hover, &.Mui-selected': {
                          backgroundColor: theme.palette.warmNeutral.cream
                        }
                      })}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontWeight: 600, color: 'text.primary' }
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
                <Typography
                  variant='caption'
                  sx={theme => ({
                    display: 'block',
                    px: 2,
                    py: 1,
                    fontSize: '0.68rem',
                    backgroundColor: theme.palette.warmNeutral.cream,
                    color: theme.palette.text.secondary
                  })}
                >
                  {dataAttribution.osOpenNames}{' '}
                  <ExternalLink href={dataAttribution.osOpenNamesLicense}>
                    Open Government Licence
                  </ExternalLink>
                  .{' '}
                  <ExternalLink href={dataAttribution.overtureAttribution}>
                    {dataAttribution.overturePlaces}
                  </ExternalLink>
                  .
                </Typography>
              </>
              )
            : (
              <Typography
                variant='body2'
                sx={{ px: 2, py: 1.5, textAlign: 'center' }}
              >
                No matching places found in Great Britain.
              </Typography>
              )}
        </Paper>
      )}
    </Box>
  )
}

export default PostcodeSearch
