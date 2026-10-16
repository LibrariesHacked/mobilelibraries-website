import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import Container from '@mui/material/Container'
import MaterialLink from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'

/**
 * Page footer displaying links to informational pages (Accessibility, Data, Privacy).
 * Hidden when viewing the full-screen map.
 * @returns {JSX.Element | null} Footer component or null on the map route.
 */
const Footer = () => {
  const mapPage = useMatch('/map')
  if (mapPage) return null

  return (
    <Paper component='footer' square>
      <Container maxWidth='lg'>
        <Stack
          direction='row'
          spacing={2}
          sx={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <MaterialLink
            component={Link}
            to='/accessibility'
            title='About the accessibility of this site'
          >
            Accessibility
          </MaterialLink>
          <MaterialLink
            component={Link}
            to='/data'
            title='Maintaining the data used on this site and licensing'
          >
            Data
          </MaterialLink>
          <MaterialLink
            component={Link}
            to='/privacy'
            title='About your privacy on this site'
          >
            Privacy
          </MaterialLink>
        </Stack>
      </Container>
    </Paper>
  )
}

export default Footer
