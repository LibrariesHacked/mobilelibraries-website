import React from 'react'

import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/core/styles'

import { useSearchStateValue } from './context/searchState'

import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

const useStyles = makeStyles((theme) => ({
  search: {
    alignContent: 'center',
    textAlign: 'center',
    display: 'table',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '10px'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '5px'
  },
  title: {
    textAlign: 'center'
  }
}))

function Filters () {
  const [{ searchDistance }] = useSearchStateValue()

  const classes = useStyles()

  return (
    <>
      <Typography component='h2' variant='h6' className={classes.title}>Your mobile service</Typography>
      <Typography component='p' variant='body1' className={classes.subtitle}>Search by postcode (within {searchDistance / 1609} mile/s) or select service</Typography>
      <div className={classes.search}>
        <PostcodeSearch />
      </div>
      <ServiceFilter />
    </>
  )
}

export default Filters
