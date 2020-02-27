const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    const url = `blog${value}`

    console.log(url)

    createNodeField({
      name: `slug`,
      node,
      value: url,
    })
  }
}

const path = require(`path`)

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const blogLayout = path.resolve(`${__dirname}/src/templates/blog.js`)
  const blogListLayout = path.resolve(`${__dirname}/src/templates/blogs.js`)

  const result = await graphql(`
    query blogPosts {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
              featured
              excerpt
            }
            html
          }
        }
      }
    }
  `)

  if (result.errors) {
    console.error(result.errors)
  }

  const posts = result.data.allMarkdownRemark.edges
  const postsPerPage = 9
  const postsWithoutFeatured = posts.filter(({ node }) => {
    return !node.frontmatter.featured
  })
  const numPages = Math.ceil(postsWithoutFeatured.length / postsPerPage)

  // Creating blog list with pagination.
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blogs` : `/blogs/page/${i + 1}`,
      component: blogListLayout,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        currentPage: i + 1,
        numPages,
      },
    })
  })

  // Creating blog posts.
  posts.forEach((post, index, arr) => {
    const prev = arr[index - 1]
    const next = arr[index + 1]

    createPage({
      path: post.node.fields.slug,
      component: blogLayout,
      context: {
        slug: post.node.fields.slug,
        prev: prev,
        next: next,
      },
    })
  })
}
