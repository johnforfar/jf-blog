export const pageMap = [{
  name: "index",
  route: "/",
  frontMatter: {
    "type": "page",
    "title": "Nextra blog template integration with Code Wallet",
    "date": new Date(1704758400000),
    "description": "Welcome to my blog about code and technology."
  }
}, {
  name: "posts",
  route: "/posts",
  children: [{
    name: "hello-world",
    route: "/posts/hello-world",
    frontMatter: {
      "title": "Hello World",
      "date": new Date(1736380800000),
      "description": "My first blog post with Code Wallet integration"
    }
  }]
}];