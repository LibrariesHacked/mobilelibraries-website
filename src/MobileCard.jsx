import React from 'react'

import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import GridOnIcon from '@mui/icons-material/GridOnTwoTone'
import MoreVertIcon from '@mui/icons-material/MoreVertTwoTone'
import WebIcon from '@mui/icons-material/WebTwoTone'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'
import * as urlHelper from './helpers/url'

const bull = (
  <Box component='span' sx={{ display: 'inline-block', mx: 0.75 }}>
    •
  </Box>
)

/**
 * Summary card for a single mobile library showing route/stop counts, live status, and quick actions.
 * @param {Object} props - Component props.
 * @param {import('./models/mobiles').Mobile} props.mobile - Mobile library model instance.
 * @param {import('./models/organisations').Organisation} [props.organisation] - Owning library authority.
 * @param {import('./models/mobiles').MobileLocation} [props.location] - Live vehicle location.
 * @param {Object} [props.status] - Precomputed status object from `location.getStatus()`.
 * @returns {JSX.Element} MobileCard element.
 */
const MobileCard = props => {
  const { mobile, organisation, location, status: statusProp } = props
  const [{}, dispatchSearch] = useSearchStateValue() // eslint-disable-line
  const [{}, dispatchView] = useViewStateValue() // eslint-disable-line

  const viewStopsByMobile = (organisationId, mobileId) => {
    dispatchSearch({
      type: 'FilterByMobile',
      organisationId,
      mobileId
    })
  }

  const viewStop = stopId => {
    dispatchSearch({ type: 'SetCurrentStop', currentStopId: stopId })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
  }

  const displayMobileLibraryInfo = mobileId => {
    dispatchSearch({
      type: 'SetCurrentMobileLibrary',
      mobileLibraryId: mobileId
    })
    dispatchView({
      type: 'SetMobileLibraryDialog',
      mobileLibraryDialogOpen: true
    })
  }

  const goToWebsite = () => urlHelper.openUrl(mobile.timetable)

  const stopButton = stop => (
    <Button
      size='small'
      onClick={() => viewStop(stop.stopId)}
      sx={{ minWidth: 0, px: 0.75, py: 0.25, verticalAlign: 'baseline' }}
    >
      {stop.stopName}
    </Button>
  )

  const renderStatusMessage = status => {
    if (!status) return null
    if (status.type === 'preRoute' || status.type === 'betweenStops') {
      return (
        <Typography variant='body2'>
          {status.message}
          {stopButton(status.args[0])}
          {status.args[1]}
        </Typography>
      )
    }
    if (status.type === 'atStop') {
      return (
        <Typography variant='body2'>
          {status.message}
          {stopButton(status.args[0])}
          {' for ' + status.args[1]}
        </Typography>
      )
    }
    return <Typography variant='body2'>{status.message}</Typography>
  }

  const status = statusProp || (location ? location.getStatus() : null)
  const displayTitle = mobile.getDisplayTitle(organisation)

  return (
    <Card>
      <CardHeader
        subheader={
          <>
            {mobile.routeCountDescription}
            {bull}
            {mobile.stopCountDescription}
          </>
        }
      />
      <CardContent>
        <Typography variant='h6' component='h2' gutterBottom>
          {displayTitle}
        </Typography>
        {renderStatusMessage(status)}
      </CardContent>
      <Divider />
      <CardActions>
        <Tooltip title='Mobile library stops'>
          <Button
            component={Link}
            to='/'
            onClick={() =>
              viewStopsByMobile(
                organisation ? organisation.id : mobile.organisationId,
                mobile.id
              )}
            startIcon={<GridOnIcon />}
          >
            View stops
          </Button>
        </Tooltip>
        <Stack direction='row' spacing={0.5}>
          {mobile.timetable
            ? (
              <Tooltip title='Website timetable' describeChild>
                <IconButton
                  aria-label={`Website timetable for ${displayTitle}`}
                  onClick={goToWebsite}
                >
                  <WebIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              )
            : null}
          <Tooltip title='See more mobile details' describeChild>
            <IconButton
              aria-label={`More details for ${displayTitle}`}
              onClick={() => displayMobileLibraryInfo(mobile.id)}
            >
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  )
}

export default React.memo(MobileCard)
