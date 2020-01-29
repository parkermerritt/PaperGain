const path = require(`path`)
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)
  // Auto generate pages
  // Pages built using templates/page-template.js
  const pageData = [
    {
      name: "profile",
      title:
        "This is the research page.",
      content:
        "Here we share our favorite reads and resources.",
    },
    {
      name: "about",
      title:
        "Welcome to Paper Gain.",
      content:
        "Paper Gain is an online media franchise focused on entrepreneurship, finance, and technology.",
    },
    {
      name: "contact",
      title:
        "We'd love to hear from you.",
      content:
        "We're always looking for feedback on our ideas.",
    },
    {
      name: "privacy",
      title:
        "This is the privacy page.",
      content:
        "Ooh baby I like it raw Shimmy Shimmy Ya.",
    },
    {
      name: "cookies",
      title:
        "This is the cookies page.",
      content:
        "Cache rules everything around me.",
    },
    {
      name: "404",
      title:
        "This is the error page. Please try again.",
    },
  ]
  pageData.forEach(page => {
    createPage({
      path: `/${page.name}`,
      component: require.resolve(`./src/templates/page-template.js`),
      context: { page },
    })
  })

  if (result.errors) {
    console.error(result.errors)
  }
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: path.resolve(`src/templates/post.js`),
    })
  })

  // Create blog list pages
  const posts = result.data.allMarkdownRemark.edges
  const postsPerPage = 1
  const numPages = Math.ceil(posts.length / postsPerPage)
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: path.resolve("./src/templates/blog-list-template.js"),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
  })
}
