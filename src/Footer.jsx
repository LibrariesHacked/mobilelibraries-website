import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const FOOTER_LINKS = [
  {
    to: '/',
    label: 'Home',
    title: 'Return to mobile libraries map and stop finder',
    hideOnHome: true
  },
  {
    to: '/accessibility',
    label: 'Accessibility',
    title: 'About the accessibility of this site'
  },
  {
    to: '/data',
    label: 'Data',
    title: 'Maintaining the data used on this site and licensing'
  },
  {
    to: '/privacy',
    label: 'Privacy',
    title: 'About your privacy on this site'
  }
]

/**
 * Integrated page footer sitting directly on the warm cream canvas with
 * prominent navigation links separated by bullet points.
 *
 * @returns {JSX.Element} Footer component.
 */
const Footer = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const visibleLinks = FOOTER_LINKS.filter(item => !(isHome && item.hideOnHome))

  return (
    <Box
      component='footer'
      sx={{
        py: 2,
        mt: 'auto'
      }}
    >
      <Container maxWidth='xl'>
        <Stack
          direction='row'
          spacing={1}
          useFlexGap
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          {visibleLinks.map((item, idx) => (
            <React.Fragment key={item.to}>
              {idx > 0 && (
                <Typography
                  component='span'
                  aria-hidden='true'
                  sx={{
                    color: 'primary.main',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    userSelect: 'none'
                  }}
                >
                  •
                </Typography>
              )}
              <Button
                component={Link}
                to={item.to}
                variant='text'
                title={item.title}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  px: 1.25,
                  py: 0.5
                }}
              >
                {item.label}
              </Button>
            </React.Fragment>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
