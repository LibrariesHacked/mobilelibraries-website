import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
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

/**
 * Dialog modal displaying address, schedule, and export links (ICS, PDF, timetable) for a selected stop.
 * @returns {JSX.Element} StopDetails dialog component.
 */
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

  const getStopCalendar = () => urlHelper.openUrl(stop.icsUrl)
  const getStopPdf = () => urlHelper.openUrl(stop.pdfUrl)
  const goToWebsite = () => urlHelper.openUrl(stop.timetable)

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
      aria-labelledby='stop-details-dialog-title'
    >
      {Object.keys(stop).length > 0 && stop.routeDays
        ? (
          <>
            <DialogTitle id='stop-details-dialog-title'>{stop.name}</DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table aria-label='Stop address and authority'>
                  <TableBody>
                    <TableRow>
                      <TableCell component='th' scope='row' variant='head'>Address</TableCell>
                      <TableCell>{stop.address}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component='th' scope='row' variant='head'>Authority</TableCell>
                      <TableCell>{stop.organisationName}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <TableContainer>
                <Table aria-label='Stop schedule'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Frequency</TableCell>
                      <TableCell align='right'>Next visit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stop.routeFrequencyDescriptions.map((rs, idx) => (
                      <TableRow key={'tc_rs_' + idx}>
                        <TableCell component='th' scope='row'>
                          {`${stop.routeDays[0]}, ${rs}`}
                        </TableCell>
                        <TableCell align='right'>
                          {stop.nextVisitFormatted}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack
                direction='row'
                spacing={1.5}
                useFlexGap
                sx={{ flexWrap: 'wrap' }}
              >
                {config.displayWebLinks && (
                  <Button
                    onClick={goToWebsite}
                    variant='outlined'
                    startIcon={<WebIcon />}
                  >
                    {urlHelper.getDomainFromUrl(stop.timetable)}
                  </Button>
                )}
                <Button
                  onClick={getStopCalendar}
                  variant='outlined'
                  startIcon={<SaveIcon />}
                >
                  Save calendar file
                </Button>
                <Button
                  onClick={getStopPdf}
                  variant='outlined'
                  startIcon={<PrintIcon />}
                >
                  Print PDF
                </Button>
              </Stack>
            </DialogContent>
          </>
          )
        : (
          <>
            <DialogTitle id='stop-details-dialog-title'>Stop details</DialogTitle>
            <DialogContent>
              <CircularProgress
                size={30}
                aria-label='Loading stop details'
                sx={{ m: 3, mx: 'auto' }}
              />
            </DialogContent>
          </>
          )}
      <DialogActions>
        <Button onClick={close} color='secondary' endIcon={<CancelIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StopDetails
