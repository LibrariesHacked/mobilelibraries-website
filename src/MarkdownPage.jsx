import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'markdown-to-jsx'

import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import ExternalLink from './ExternalLink'

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h4'
      }
    },
    h2: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h5',
        sx: { mt: 3 }
      }
    },
    h3: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h6',
        sx: { mt: 2 }
      }
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'subtitle1',
        sx: { mb: 2 }
      }
    },
    p: {
      component: Typography,
      props: { variant: 'body2', sx: { mb: 2 } }
    },
    a: {
      component: ({ href, children, ...rest }) => {
        const isExternal = Boolean(href && /^https?:\/\//i.test(href))
        const Component = isExternal ? ExternalLink : Link
        return (
          <Component href={href} {...rest}>
            {children}
          </Component>
        )
      }
    },
    li: {
      component: ({ ...props }) => (
        <li>
          <Typography component='span' variant='body2' {...props} />
        </li>
      )
    }
  }
}

/**
 * Fetches and renders a static Markdown document inside a themed Paper card.
 * @param {{ page: string }} props - Component props containing the URL/asset path to the markdown file.
 * @returns {JSX.Element} Rendered markdown page.
 */
const MarkdownPage = props => {
  const { page } = props
  const [pageText, setPageText] = useState('')
  const [pageStatus, setPageStatus] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPage () {
      try {
        const pageData = await window.fetch(page, {
          signal: controller.signal
        })
        if (!pageData.ok) {
          setPageStatus('error')
          return
        }

        const content = await pageData.text()
        setPageText(content)
        setPageStatus('loaded')
      } catch {
        if (!controller.signal.aborted) setPageStatus('error')
      }
    }

    setPageText('')
    setPageStatus('loading')
    fetchPage()

    return () => controller.abort()
  }, [page])

  return (
    <Paper
      sx={{
        p: { xs: 2.5, sm: 4 },
        mt: 1,
        borderRadius: 1
      }}
    >
      {pageStatus === 'error'
        ? (
          <Typography role='alert' variant='body2'>
            This page couldn't be loaded. Please try again later.
          </Typography>
          )
        : pageStatus === 'loading'
          ? (
            <Typography role='status' variant='body2'>Loading page…</Typography>
            )
          : (
            <ReactMarkdown options={options}>{pageText}</ReactMarkdown>
            )}
    </Paper>
  )
}

const MemoMarkdownPage = React.memo(MarkdownPage)

export default MemoMarkdownPage
