import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'markdown-to-jsx'

import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h2',
        color: 'secondary'
      }
    },
    h2: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h3', color: 'textSecondary' }
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h5', color: 'textSecondary' }
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h6',
        paragraph: true,
        color: 'textPrimary'
      }
    },
    p: {
      component: Typography,
      props: { paragraph: true, color: 'textPrimary' }
    },
    a: {
      component: Link,
      props: {
        sx: {
          fontWeight: 600
        }
      }
    },
    li: {
      component: ({ ...props }) => (
        <li>
          <Typography component='span' {...props} />
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
    <ReactMarkdown options={options} {...props}>
      {pageText}
    </ReactMarkdown>
  )
}

const MemoMarkdownPage = React.memo(MarkdownPage)

export default MemoMarkdownPage
