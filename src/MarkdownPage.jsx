import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'markdown-to-jsx'

import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

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
      component: Link
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

  useEffect(() => {
    async function fetchPage () {
      const pageData = await window.fetch(page)
      const pageText = await pageData.text()
      setPageText(pageText)
    }
    fetchPage()
  }, [page])

  return (
    <Paper variant='outlined' sx={{ p: { xs: 2.5, sm: 4 }, mt: 2 }}>
      <ReactMarkdown options={options} {...props}>
        {pageText}
      </ReactMarkdown>
    </Paper>
  )
}

const MemoMarkdownPage = React.memo(MarkdownPage)

export default MemoMarkdownPage
