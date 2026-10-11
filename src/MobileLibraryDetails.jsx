import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import CancelIcon from '@mui/icons-material/CancelRounded'
import GridOnIcon from '@mui/icons-material/GridOnTwoTone'
import WebIcon from '@mui/icons-material/WebRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as urlHelper from './helpers/url'

/**
 * Dialog modal displaying detailed information, status, and routes for a selected mobile library.
 * @returns {JSX.Element} MobileLibraryDetails dialog component.
 */
const MobileLibraryDetails = () => {
  const [{ mobileLookup, organisationLookup, mobileLocationLookup, routes }] =
    useApplicationStateValue()
  const [{ currentMobileLibraryId }, dispatchSearch] = useSearchStateValue()
  const [{ mobileLibraryDialogOpen }, dispatchView] = useViewStateValue()

  const [mobileLibrary, setMobileLibrary] = useState({})

  useEffect(() => {
    if (currentMobileLibraryId != null && mobileLookup) {
      setMobileLibrary(mobileLookup[currentMobileLibraryId] || {})
    }
  }, [currentMobileLibraryId, mobileLookup])

  const close = () => {
    dispatchView({
      type: 'SetMobileLibraryDialog',
      mobileLibraryDialogOpen: false
    })
  }

  const viewStopsByMobile = () => {
    if (mobileLibrary && mobileLibrary.id) {
      dispatchSearch({
        type: 'FilterByMobile',
        organisationId: mobileLibrary.organisationId,
        mobileId: mobileLibrary.id
      })
      close()
    }
  }

  const viewStopsByRoute = routeId => {
    if (mobileLibrary && mobileLibrary.id) {
      dispatchSearch({
        type: 'FilterByMobile',
        organisationId: mobileLibrary.organisationId,
        mobileId: mobileLibrary.id
      })
      dispatchSearch({
        type: 'FilterByRoute',
        routeId
      })
      close()
    }
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const organisation =
    mobileLibrary && mobileLibrary.organisationId && organisationLookup
      ? organisationLookup[mobileLibrary.organisationId]
      : null

  const location =
    mobileLibrary && mobileLibrary.id && mobileLocationLookup
      ? mobileLocationLookup[mobileLibrary.id]
      : null

  const status = location ? location.getStatus() : null

  const mobileRoutes = useMemo(() => {
    if (!mobileLibrary || !mobileLibrary.id || !routes) return []
    return routes
      .filter(r => r.mobileId === mobileLibrary.id)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [mobileLibrary, routes])

  const websiteUrl =
    (mobileLibrary && mobileLibrary.timetable) ||
    (organisation && (organisation.timetable || organisation.website)) ||
    null

  return (
    <Dialog
      fullScreen={fullScreen}
      open={mobileLibraryDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
    >
      {mobileLibrary && mobileLibrary.id
        ? (
          <>
            <DialogTitle id='dlg-title'>
              {mobileLibrary.getDisplayTitle(organisation, ' - ')}
            </DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table>
                  <TableBody>
                    {organisation
                      ? (
                        <TableRow>
                          <TableCell variant='head'>Authority</TableCell>
                          <TableCell>{organisation.name}</TableCell>
                        </TableRow>
                        )
                      : null}
                    {status && status.textFormat
                      ? (
                        <TableRow>
                          <TableCell variant='head'>Status</TableCell>
                          <TableCell>{status.textFormat}</TableCell>
                        </TableRow>
                        )
                      : null}
                    <TableRow>
                      <TableCell variant='head'>Routes</TableCell>
                      <TableCell>{mobileLibrary.numberRoutes}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Stops</TableCell>
                      <TableCell>{mobileLibrary.numberStops}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {mobileRoutes.length > 0
                ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Route</TableCell>
                          <TableCell>Frequency</TableCell>
                          <TableCell align='right'>Stops</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mobileRoutes.map(route => (
                          <TableRow key={'tc_rt_' + route.id}>
                            <TableCell component='th' scope='row'>
                              <Button
                                component={Link}
                                to='/'
                                onClick={() => viewStopsByRoute(route.id)}
                                sx={{ minWidth: 0, px: 1, py: 0.5 }}
                              >
                                {route.name}
                              </Button>
                            </TableCell>
                            <TableCell>{route.frequencyDescription}</TableCell>
                            <TableCell align='right'>
                              {route.numberStops}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  )
                : null}
              <Stack direction='row' spacing={1.5} flexWrap='wrap' useFlexGap>
                <Button
                  component={Link}
                  to='/'
                  onClick={viewStopsByMobile}
                  variant='outlined'
                  startIcon={<GridOnIcon />}
                >
                  View all stops
                </Button>
                {websiteUrl
                  ? (
                    <Button
                      onClick={() => urlHelper.openUrl(websiteUrl)}
                      variant='outlined'
                      startIcon={<WebIcon />}
                    >
                      {urlHelper.getDomainFromUrl(websiteUrl)}
                    </Button>
                    )
                  : null}
              </Stack>
            </DialogContent>
          </>
          )
        : (
          <CircularProgress size={30} sx={{ m: 3, mx: 'auto' }} />
          )}
      <DialogActions>
        <Button onClick={close} color='secondary' endIcon={<CancelIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MobileLibraryDetails
