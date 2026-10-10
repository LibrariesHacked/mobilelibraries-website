import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import CancelIcon from '@mui/icons-material/CancelRounded'
import SaveIcon from '@mui/icons-material/SaveAltRounded'
import PrintIcon from '@mui/icons-material/PrintRounded'
import WebIcon from '@mui/icons-material/WebRounded'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as stopModel from './models/stops'

import * as urlHelper from './helpers/url'

import config from './helpers/config.json'

const StopDetails = () => {
  const [{ currentStopId }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ stopDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [stop, setStop] = useState({})

  useEffect(() => {
    async function getStop (stopId) {
      const stopData = await stopModel.getStopById(stopId)
      setStop(stopData)
    }
    if (currentStopId != null) getStop(currentStopId)
  }, [currentStopId])

  const getStopCalendar = () =>
    window.open(config.api + '/stops/' + stop.id + '/ics')

  const getStopPdf = () =>
    window.open(config.api + '/stops/' + stop.id + '/pdf', '_blank')

  const goToWebsite = () => window.open(stop.timetable, '_blank')

  const close = () => {
    dispatchSearch({
      type: 'SetCurrentStop',
      currentStopId: null
    })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: false })
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={stopDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
    >
      {Object.keys(stop).length > 0 && stop.routeDays
        ? (
          <>
            <DialogTitle id='dlg-title'>{stop.name}</DialogTitle>
            <DialogContent dividers>
              <TableContainer
                component={Paper}
                variant='outlined'
                sx={{ mb: 2.5 }}
              >
                <Table size='small'>
                  <TableBody>
                    <TableRow>
                      <TableCell variant='head'>Address</TableCell>
                      <TableCell>{stop.address}</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell variant='head'>Authority</TableCell>
                      <TableCell>{stop.organisationName}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <TableContainer
                component={Paper}
                variant='outlined'
                sx={{ mb: 2 }}
              >
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Frequency</TableCell>
                      <TableCell align='right'>Next visit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stop.routeFrequencyDescriptions.map((rs, idx) => (
                      <TableRow
                        key={'tc_rs_' + idx}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          {`${stop.routeDays[0]}, ${rs}`}
                        </TableCell>
                        <TableCell align='right'>
                          {stop.routeSchedule[0].format('dddd Do MMMM h:mma')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                {config.displayWebLinks && (
                  <Button
                    onClick={() => goToWebsite()}
                    color='primary'
                    variant='outlined'
                    size='small'
                    startIcon={<WebIcon />}
                  >
                    {urlHelper.getDomainFromUrl(stop.timetable)}
                  </Button>
                )}
                <Button
                  onClick={getStopCalendar}
                  color='primary'
                  variant='outlined'
                  size='small'
                  startIcon={<SaveIcon />}
                >
                  Save calendar file
                </Button>
                <Button
                  onClick={getStopPdf}
                  color='primary'
                  variant='outlined'
                  size='small'
                  startIcon={<PrintIcon />}
                >
                  Print PDF
                </Button>
              </Stack>
            </DialogContent>
          </>
          )
        : (
          <CircularProgress color='primary' size={30} sx={{ m: 3, mx: 'auto' }} />
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

export default StopDetails
