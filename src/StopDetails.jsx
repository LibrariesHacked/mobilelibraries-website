import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ListSubheader from '@mui/material/ListSubheader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { lighten } from '@mui/material'

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
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }
      }}
      PaperProps={{ elevation: 0, sx: { border: 1, borderColor: '#ccc' } }}
    >
      {Object.keys(stop).length > 0 && stop.routeDays
        ? (
          <>
            <DialogTitle id='dlg-title'>{stop.name}</DialogTitle>
            <DialogContent>
              <ListSubheader disableSticky sx={{ textAlign: 'center' }}>
                Quick info and schedule
              </ListSubheader>
              <Box
                sx={{
                  border: 2,
                  borderRadius: 2,
                  borderColor: theme =>
                    lighten(theme.palette.secondary.main, 0.5),
                  marginBottom: theme => theme.spacing(1),
                  padding: theme => theme.spacing(1)
                }}
              >
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    marginBottom: theme => theme.spacing(3)
                  }}
                >
                  <Table size='small'>
                    <TableBody>
                      <TableRow>
                        <TableCell variant='head'>Address</TableCell>
                        <TableCell>{stop.address}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant='head'>Authority</TableCell>
                        <TableCell>{stop.organisationName}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    backgroundColor: theme =>
                      lighten(theme.palette.secondary.main, 0.9),
                    marginBottom: theme => theme.spacing(2),
                    border: 1,
                    borderRadius: 2,
                    borderColor: theme =>
                      lighten(theme.palette.secondary.main, 0.8)
                  }}
                >
                  <Table
                    size='small'
                    sx={{
                      [`& .${tableCellClasses.root}`]: { borderBottom: 'none' }
                    }}
                  >
                    <TableHead>
                      <TableRow>
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
                          Next visit
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stop.routeFrequencyDescriptions.map((rs, idx) => (
                        <TableRow key={'tc_rs_' + idx}>
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
                {config.displayWebLinks && (
                  <Button
                    onClick={() => goToWebsite()}
                    color='secondary'
                    startIcon={<WebIcon />}
                    sx={{
                      marginRight: theme => theme.spacing(1)
                    }}
                  >
                    {urlHelper.getDomainFromUrl(stop.timetable)}
                  </Button>
                )}
                <Button
                  onClick={getStopCalendar}
                  color='secondary'
                  startIcon={<SaveIcon />}
                  sx={{
                    marginRight: theme => theme.spacing(1)
                  }}
                >
                  Save calendar file
                </Button>
                <Button
                  onClick={getStopPdf}
                  color='secondary'
                  startIcon={<PrintIcon />}
                  sx={{
                    marginRight: theme => theme.spacing(1)
                  }}
                >
                  Print PDF
                </Button>
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

export default StopDetails
