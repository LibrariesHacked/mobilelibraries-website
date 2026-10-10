import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import MaterialLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'

const Footer = () => {
  const mapPage = useMatch('/map')
  if (mapPage) return null

  return (
    <Box
      component='footer'
      sx={{
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 2.5,
        mt: 'auto'
      }}
    >
      <Container maxWidth='lg'>
        <Stack
          direction='row'
          spacing={3}
          justifyContent='center'
          alignItems='center'
        >
          <MaterialLink
            component={Link}
            to='/accessibility'
            color='text.secondary'
            underline='hover'
            variant='body2'
            title='About the accessibility of this site'
          >
            Accessibility
          </MaterialLink>
          <MaterialLink
            component={Link}
            to='/data'
            color='text.secondary'
            underline='hover'
            variant='body2'
            title='Maintaining the data used on this site and licensing'
          >
            Data
          </MaterialLink>
          <MaterialLink
            component={Link}
            to='/privacy'
            color='text.secondary'
            underline='hover'
            variant='body2'
            title='About your privacy on this site'
          >
            Privacy
          </MaterialLink>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
