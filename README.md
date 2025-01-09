# Next.js Blog with Code Wallet Integration

A minimalist blog template built with Next.js, MDX, and Code Wallet integration for receiving tips. Fork this repository to create your own blog with built-in tipping functionality.

## Features

* 🚀 Built with Next.js and MDX
* 💰 Code Wallet integration for receiving tips
* 🌓 Dark mode support
* 📱 Responsive design
* 🖼️ Support for images (via GitHub Pages)
* 🎥 YouTube video embeds
* 🔄 Multiple deployment options

## Quick Start

1. Fork this repository
2. Clone your forked repository
3. Install dependencies:

```
bun install
```

4. Create a .env file:

```
NEXT_PUBLIC_CODE_WALLET_ADDRESS=your_code_wallet_address
NEXT_PUBLIC_CODE_WALLET_AMOUNT=0.05
```

5. Run the development server:

```
bun dev
```

## Adding Content

### Blog Posts

Create new .mdx files in pages/posts/ directory:

```
---
title: My Post Title
date: 2024-03-21
description: A brief description
---

# My Post Title
Content goes here...

<CodeWallet />
```

### Adding Media

* **Images**: Store images in GitHub Pages and reference them:
```
![Alt text](image-url)
```

* **Videos**: Embed YouTube videos:
```
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0"
  allowfullscreen
></iframe>
```

## Deployment Options

### Vercel (Recommended)

1. Fork this repository
2. Go to Vercel
3. Import your forked repository
4. Add environment variables
5. Deploy

Free tier includes:
* Unlimited static sites
* Automatic HTTPS
* Global CDN
* Continuous deployment

### GitHub Pages

1. Update next.config.mjs:

```
export default withNextra({
  output: 'export',
  basePath: '/your-repo-name'
})
```

2. Add GitHub Actions workflow:

```
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: bun install
      - run: bun run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## Environment Variables

Required environment variables:
* NEXT_PUBLIC_CODE_WALLET_ADDRESS: Your Code Wallet address for receiving tips
* NEXT_PUBLIC_CODE_WALLET_AMOUNT: Default tip amount in USD

## License

MIT License - feel free to use this template for your own blog!

## Acknowledgments

* Built with Next.js
* Blog functionality by Nextra
* Tipping powered by Code Wallet

## Example Post

Check out the Hello World post to see how to:
* Add images from GitHub Pages
* Embed YouTube videos
* Include a Code Wallet tip button