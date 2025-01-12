# Nextra Blog Template with Code Wallet

A simple blog template that lets you write posts and receive tips through Code Wallet. This blog uses Nextra, a Next.js-based static site generator that makes it easy to write content in Markdown.

## Features

* 💰 Receive tips with Code Wallet 
* ✍️ Easy writing using Markdown
* 📱 Works on mobile
* 🌙 Dark mode included
* 🖼️ Add images easily
* 🎥 Add YouTube videos
* ⚡ Fast loading

## Local Development

1. Clone your repository:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Create a `.env` file:
```
NEXT_PUBLIC_CODE_WALLET_ADDRESS=your_wallet_address
NEXT_PUBLIC_CODE_WALLET_AMOUNT=0.05
```

4. Start the development server:
```bash
npm run dev
# or
bun run dev
```

Visit `http://localhost:3000` to see your blog.

## Deployment Options

### GitHub Pages
1. Fork this repository
2. Clone your fork locally
3. Make your changes
4. Deploy using:
```bash
npm run deploy
# or
bun run deploy
```
Your blog will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

For custom domains, go to repository Settings > Pages > Custom domain. GitHub Pages will show you the DNS settings to configure at your domain provider.

### Vercel (Alternative)
1. Fork this repository
2. Go to [Vercel](https://vercel.com/new)
3. Import your forked repository
4. Add your environment variables:
   - `NEXT_PUBLIC_CODE_WALLET_ADDRESS`
   - `NEXT_PUBLIC_CODE_WALLET_AMOUNT`
5. Deploy

For custom domains, go to your project settings in Vercel > Domains. Vercel will guide you through the DNS configuration.

## Writing Blog Posts

1. Create a new `.mdx` file in `pages/posts/`
2. Add the front matter:
```mdx
---
title: My Blog Post
date: 2024-01-09
description: A short description
---

# Your content here

<CodeWallet />
```

## Adding Media

### Images
Put images in the `public` folder and reference them in your posts:
```mdx
<img src={process.env.NODE_ENV === 'production' ? 'your-image.jpg' : '/your-image.jpg'} alt="Description" />
```

### YouTube Videos
```html
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameBorder="0"
  allowFullScreen
></iframe>
```

## Getting Tips

1. Install Code Wallet on your phone
2. Add your wallet address to `.env`:
```
NEXT_PUBLIC_CODE_WALLET_ADDRESS=your_wallet_address
NEXT_PUBLIC_CODE_WALLET_AMOUNT=0.05
```

## Example Post

Check out [Hello World](./posts/hello-world) to see it all in action!

## License

MIT License - Feel free to use this template!

## Thanks to

* [Next.js](https://nextjs.org) - The React Framework
* [Nextra](https://nextra.site) - Making blogs easy
* [Code Wallet](https://codewallet.ai) - For tipping