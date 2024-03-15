import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import Grid from '@mui/material/Grid'
import MaterialLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import { Carbonbadge } from 'react-carbonbadge'

const Footer = () => {
  const mapPage = useMatch('/map')
  return (
    <Grid
      container
      spacing={2}
      sx={{
        marginTop: theme => theme.spacing(2),
        paddingTop: theme => theme.spacing(2),
        paddingBottom: theme => theme.spacing(4)
      }}
    >
      <Grid item xs={12} sm={12} md={5} lg={4} xl={4}>
        <Typography variant='h6'>
          <MaterialLink
            component={Link}
            to='/accessibility'
            title='About the accessibility of this site'
          >
            Accessibility
          </MaterialLink>
          <br />
          <MaterialLink
            component={Link}
            to='/data'
            title='Maintaining the data used on this site and licensing'
          >
            Data
          </MaterialLink>
          <br />
          <MaterialLink
            component={Link}
            to='/privacy'
            title='About your privacy on this site'
          >
            Privacy
          </MaterialLink>
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={4}
        lg={4}
        xl={4}
        sx={{ display: mapPage ? 'none' : 'block' }}
      >
        <Carbonbadge />
      </Grid>
      <Grid item xs={12} sm={12} md={3} lg={4} xl={4}></Grid>
    </Grid>
  )
}

export default Footer
