import React from 'react'
import { graphql } from 'gatsby'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import LinkButton from '../components/UI/Button/LinkButton'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import CalendarToday from '@material-ui/icons/CalendarToday'
import Create from '@material-ui/icons/Create'
import LocalOffer from '@material-ui/icons/LocalOffer'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    height: `100%`,
  },
  iconText: {
    display: 'flex',
    alignItems: 'baseline',
    padding: '5px 0px 5px 0px',
  },
  icon: {
    alignSelf: 'center',
    '& svg': {
      fill: '#56ccf2',
      fontSize: theme.typography.caption.fontSize,
      marginRight: theme.spacing(0.5),
    },
  },
  blogContent: {
    '& div p': {
      ...theme.typography.body1,
    },
  },
}))

export default function Blog({ data, pageContext }) {
  const classes = useStyles()
  const { markdownRemark } = data
  const { prev, next } = pageContext

  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      className={classes.root}
    >
      <Grid container direction="column" justify="space-evenly">
        <Grid item>
          <Typography variant="h6">
            {markdownRemark.frontmatter.title}
          </Typography>
          <Divider />
        </Grid>
        <Grid
          container
          direction="row"
          alignContent="center"
          justify="space-between"
        >
          <div className={classes.iconText}>
            <span className={classes.icon}>
              <Create />
            </span>
            <Typography variant="caption">
              {markdownRemark.frontmatter.author}
            </Typography>
          </div>
          <div className={classes.iconText}>
            <span className={classes.icon}>
              <CalendarToday />
            </span>
            <Typography variant="caption">
              {markdownRemark.frontmatter.date}
            </Typography>
          </div>
        </Grid>
        <Grid>
          <div className={classes.iconText}>
            <span className={classes.icon}>
              <LocalOffer />
            </span>
            <Typography variant="caption">
              {markdownRemark.frontmatter.tags.join(', ')}
            </Typography>
          </div>
        </Grid>
        <Grid item className={classes.blogContent}>
          <div dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
        </Grid>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item>
          {prev && (
            <LinkButton
              to={prev.node.fields.slug}
              startIcon={<NavigateBeforeIcon />}
            >
              PREV
            </LinkButton>
          )}
        </Grid>
        <Grid item>
          {next && (
            <LinkButton
              to={next.node.fields.slug}
              endIcon={<NavigateNextIcon />}
            >
              NEXT
            </LinkButton>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        author
        tags
      }
    }
  }
`
