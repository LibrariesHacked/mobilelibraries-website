import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid2 from '@mui/material/Grid2'
import MaterialLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const Footer = () => {
  const mapPage = useMatch('/map')
  return (
    <Box
      sx={{
        backgroundColor: theme => theme.palette.background.paper,
        border: theme => `1px solid ${theme.palette.divider}`,
        marginTop: theme => theme.spacing(2),
        padding: theme => theme.spacing(2)
      }}
    >
      <Container maxWidth='lg'>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} sm={12} md={6} lg={6} xl={6}>
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
          </Grid2>
          <Grid2
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            sx={{ display: mapPage ? 'none' : 'block' }}
          />
        </Grid2>
      </Container>
    </Box>
  )
}

export default Footer
