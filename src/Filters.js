import React from 'react'

import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/core/styles'

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
  const classes = useStyles()

  return (
    <>
      <Typography color='secondary' component='h2' variant='h3' className={classes.title}>Mobile libraries</Typography>
      <Typography component='p' variant='body1' className={classes.subtitle}>Search by postcode or library service</Typography>
      <div className={classes.search}>
        <PostcodeSearch settings />
      </div>
      <ServiceFilter />
    </>
  )
}

export default Filters
