import React from 'react'
import { Link } from 'react-router-dom'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import MaterialLink from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(5),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(5),
    width: '100%'
  },
  bullet: {
    margin: theme.spacing(2)
  },
  grid: {
    marginTop: theme.spacing(2)
  },
  footerText: {
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
  footerRight: {
    textAlign: 'right'
  },
  tapTarget: {
    lineHeight: 2.2,
    fontSize: 16
  }
}))

function Footer () {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Divider />
      <Grid container spacing={3} className={classes.grid}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Typography variant='button'>
            <MaterialLink component={Link} to='/accessibility' title='How we make this site accessible' className={classes.tapTarget}>Accessibility</MaterialLink>
            <span className={classes.bullet}> &#8226; </span>
            <MaterialLink component={Link} to='/privacy' title='Your privacy on this site' className={classes.tapTarget}>Privacy</MaterialLink>
            <span className={classes.bullet}> &#8226; </span>
            <MaterialLink component={Link} to='/data' title='Data used on this site and licensing' className={classes.tapTarget}>Data</MaterialLink>
          </Typography>
          <br />
          <Typography variant='body2' className={classes.footerText}>A Library Lab project by Libraries Hacked.</Typography>
        </Grid>
        <Grid className={classes.footerRight} item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Typography variant='button'>
            <MaterialLink href='https://github.com/LibrariesHacked/mobilelibraries-website' target='_blank' title='Project on GitHub' className={classes.tapTarget}>Open Source on GitHub</MaterialLink>
            <span className={classes.bullet}> &#8226; </span>
            <MaterialLink href='https://www.librarylab.uk/docs/mobile-libraries' target='_blank' title='About the library lab projects and documentation for this project' className={classes.tapTarget}>About this project</MaterialLink>
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default Footer
