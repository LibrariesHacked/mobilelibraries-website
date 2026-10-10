import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import ListSubheader from '@mui/material/ListSubheader'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { lighten, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import CancelIcon from '@mui/icons-material/CancelRounded'
import GridOnIcon from '@mui/icons-material/GridOnTwoTone'
import WebIcon from '@mui/icons-material/WebRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import { getText } from './helpers/rrule'
import * as urlHelper from './helpers/url'

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

  const goToWebsite = url => window.open(url, '_blank')

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

  const mobileRoutes =
    mobileLibrary && mobileLibrary.id && routes
      ? routes
        .filter(r => r.mobileId === mobileLibrary.id)
        .sort((a, b) => a.name.localeCompare(b.name))
      : []

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
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)' } },
        paper: { elevation: 0, sx: { border: 1, borderColor: '#ccc' } }
      }}
    >
      {mobileLibrary && mobileLibrary.id
        ? (
          <>
            <DialogTitle id='dlg-title'>
              {(organisation ? organisation.name + ' - ' : '') +
                mobileLibrary.name}
            </DialogTitle>
            <DialogContent>
              <ListSubheader disableSticky sx={{ textAlign: 'center' }}>
                Quick info and routes
              </ListSubheader>
              <Box
                sx={{
                  border: 2,
                  borderRadius: 4,
                  borderColor: 'secondary.main',
                  marginBottom: theme => theme.spacing(1),
                  padding: theme => theme.spacing(1)
                }}
              >
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    marginBottom: theme => theme.spacing(2)
                  }}
                >
                  <Table size='small'>
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
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        backgroundColor: theme =>
                          lighten(theme.palette.secondary.main, 0.9),
                        marginBottom: theme => theme.spacing(2),
                        border: 1,
                        borderRadius: 4,
                        borderColor: 'secondary.main'
                      }}
                    >
                      <Table
                        size='small'
                        sx={{
                          [`& .${tableCellClasses.root}`]: {
                            borderBottom: 'none'
                          }
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                color: theme => theme.palette.secondary.main
                              }}
                            >
                              Route
                            </TableCell>
                            <TableCell
                              sx={{
                                color: theme => theme.palette.secondary.main
                              }}
                            >
                              Frequency
                            </TableCell>
                            <TableCell
                              align='right'
                              sx={{
                                color: theme => theme.palette.secondary.main
                              }}
                            >
                              Stops
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {mobileRoutes.map(route => (
                            <TableRow key={'tc_rt_' + route.id}>
                              <TableCell component='th' scope='row'>
                                <Button
                                  component={Link}
                                  to='/'
                                  size='small'
                                  color='primary'
                                  onClick={() => viewStopsByRoute(route.id)}
                                >
                                  {route.name}
                                </Button>
                              </TableCell>
                              <TableCell>
                                {route.frequency
                                  ? getText(route.frequency)
                                  : ''}
                              </TableCell>
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
                <Button
                  component={Link}
                  to='/'
                  onClick={() => viewStopsByMobile()}
                  color='secondary'
                  startIcon={<GridOnIcon />}
                  sx={{
                    marginRight: theme => theme.spacing(1)
                  }}
                >
                  View all stops
                </Button>
                {websiteUrl
                  ? (
                    <Button
                      onClick={() => goToWebsite(websiteUrl)}
                      color='secondary'
                      startIcon={<WebIcon />}
                      sx={{
                        marginRight: theme => theme.spacing(1)
                      }}
                    >
                      {urlHelper.getDomainFromUrl(websiteUrl)}
                    </Button>
                    )
                  : null}
              </Box>
            </DialogContent>
          </>
          )
        : (
          <CircularProgress
            color='primary'
            size={30}
            sx={{ margin: theme => theme.spacing(2) }}
          />
          )}
      <DialogActions>
        <Button
          onClick={() => close()}
          color='secondary'
          endIcon={<CancelIcon />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MobileLibraryDetails
