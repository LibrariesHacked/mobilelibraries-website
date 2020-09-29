import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'markdown-to-jsx'

import { withStyles, makeStyles } from '@material-ui/core/styles'

import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  listItem: {
    marginTop: theme.spacing(1)
  },
  root: {
    '& table': {
      display: 'block',
      wordBreak: 'normal',
      width: '100%',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderCollapse: 'collapse',
      marginBottom: '16px',
      borderSpacing: 0,
      overflow: 'hidden',
      '& .prop-name': {
        fontSize: 13,
        fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace'
      },
      '& .required': {
        color: theme.palette.type === 'light' ? '#006500' : '#a5ffa5'
      },
      '& .prop-type': {
        fontSize: 13,
        fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
        color: theme.palette.type === 'light' ? '#932981' : '#ffb6ec'
      },
      '& .prop-default': {
        fontSize: 13,
        fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
        borderBottom: `1px dotted ${theme.palette.divider}`
      }
    },
    '& td': {
      ...theme.typography.body2,
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: 16,
      color: theme.palette.text.primary
    },
    '& th': {
      fontSize: 14,
      lineHeight: theme.typography.pxToRem(24),
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.text.primary,
      whiteSpace: 'pre',
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: 16
    }
  }
}))

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h4',
        color: 'secondary'
      }
    },
    h2: { component: Typography, props: { gutterBottom: true, variant: 'h5', color: 'textPrimary' } },
    h3: { component: Typography, props: { gutterBottom: true, variant: 'h6', color: 'textPrimary' } },
    h4: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h6', paragraph: true, color: 'textPrimary' }
    },
    p: { component: Typography, props: { paragraph: true, color: 'textPrimary' } },
    a: { component: Link },
    li: {
      component: withStyles(useStyles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Typography component='span' {...props} />
        </li>
      ))
    }
  }
}

export function MarkdownPage (props) {
  const { page } = props
  const [pageText, setPageText] = useState('')
  const classes = useStyles()

  useEffect(() => {
    async function fetchPage () {
      const pageData = await window.fetch(page)
      const pageText = await pageData.text()
      setPageText(pageText)
    }
    fetchPage()
  }, [page])

  return <ReactMarkdown className={classes.root} options={options} {...props}>{pageText}</ReactMarkdown>
}

export const MemoMarkdownPage = React.memo(MarkdownPage)
