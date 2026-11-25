import React from 'react'

import Link from '@mui/material/Link'
import OpenInNewIcon from '@mui/icons-material/OpenInNewRounded'

/**
 * Reusable Material UI external link component that opens in a new window
 * (`target="_blank" rel="noopener noreferrer"`) and appends a Material
 * `OpenInNewRounded` indicator icon.
 *
 * @param {import('@mui/material/Link').LinkProps} props - MUI Link props.
 * @returns {JSX.Element} ExternalLink element.
 */
const ExternalLink = ({ children, ...props }) => (
  <Link target='_blank' rel='noopener noreferrer' {...props}>
    {children}
    <OpenInNewIcon
      aria-hidden='true'
      sx={{ fontSize: '1em', ml: 0.35, flexShrink: 0 }}
    />
  </Link>
)

export default ExternalLink
