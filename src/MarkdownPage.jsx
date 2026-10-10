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
        variant: 'h4',
        color: 'text.primary'
      }
    },
    h2: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h5',
        color: 'text.primary',
        sx: { mt: 3 }
      }
    },
    h3: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h6',
        color: 'text.secondary',
        sx: { mt: 2 }
      }
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'subtitle1',
        paragraph: true,
        color: 'text.primary'
      }
    },
    p: {
      component: Typography,
      props: { paragraph: true, color: 'text.secondary' }
    },
    a: {
      component: Link,
      props: {
        underline: 'hover',
        sx: {
          fontWeight: 500
        }
      }
    },
    li: {
      component: ({ ...props }) => (
        <li>
          <Typography component='span' color='text.secondary' {...props} />
        </li>
      )
    }
  }
}

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
