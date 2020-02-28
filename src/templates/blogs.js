import React from 'react'

import { graphql, navigate } from 'gatsby'

import Grid from '@material-ui/core/Grid'
import Pagination from '@material-ui/lab/Pagination'
import BlogCard from '../components/UI/BlogCard/BlogCard'
import { makeStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  pagination: {
    marginTop: '20px',
    justifyContent: 'center',
    display: 'flex',
    '& ul': {
      justifyContent: 'flex-start',
      '& li': {
        '& .Mui-selected': {
          textAlign: 'center',
          textTransform: 'uppercase',
          transition: '0.5s',
          backgroundSize: '200% auto',
          color: 'white',
          borderRadius: '5px',
          backgroundImage: 'linear-gradient(to right, #56ccf2, #2f80ed)',
          '&:hover': {
            backgroundPosition: 'right center',
            boxShadow: '0 7px 14px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.22)',
          },
        },
      },
    },
  },
}))

const Blogs = ({ data, pageContext }) => {
  const classes = useStyles()
  const { allMarkdownRemark } = data

  const blogDetails = allMarkdownRemark.edges.map(({ node }) => {
    return {
      title: node.frontmatter.title,
      link: node.fields.slug,
      date: node.frontmatter.date,
      author: node.frontmatter.author,
      tags: node.frontmatter.tags,
      desc: node.frontmatter.excerpt,
    }
  })

  const handleChange = (event, value) => {
    const link = value === 1 ? '/blogs' : `/blogs/page/${value}`
    navigate(link)
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="baseline"
        alignContent="center"
      >
        {blogDetails.map(blogDetail => (
          <BlogCard blog={blogDetail} key={blogDetail.title} />
        ))}
      </Grid>
      <Divider />
      <Pagination
        className={classes.pagination}
        count={pageContext.numPages}
        page={pageContext.currentPage}
        onChange={handleChange}
      />
    </div>
  )
}

export const query = graphql`
  query blogPostsList($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { featured: { eq: false } } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date
            author
            tags
            excerpt
          }
        }
      }
    }
  }
`

export default Blogs
