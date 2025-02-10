import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import MaterialLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import { Carbonbadge } from 'react-carbonbadge'

const Footer = () => {
  const mapPage = useMatch('/map')
  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          backgroundColor: theme => theme.palette.background.paper,
          border: theme => `1px solid ${theme.palette.divider}`,
          marginTop: theme => theme.spacing(2),
          marginBottom: theme => theme.spacing(2),
          padding: theme => theme.spacing(2),
          borderRadius: 2
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
            md={6}
            lg={6}
            xl={6}
            sx={{ display: mapPage ? 'none' : 'block' }}
          >
            <Carbonbadge />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Footer
