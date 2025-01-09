# Nextra Blog Template with Code Wallet

A simple blog template that lets you write posts and receive tips through Code Wallet. Perfect for non-technical people who want to start their own blog!

## Features

* 💰 Receive tips with Code Wallet 
* ✍️ Easy writing using Markdown
* 📱 Works on mobile
* 🌙 Dark mode included
* 🖼️ Add images easily
* 🎥 Add YouTube videos
* ⚡ Fast loading

## Quick Start for GitHub Pages

1. Create a GitHub account if you don't have one
2. Click "Fork" at the top of this repository 
3. Go to your new repository's Settings > Pages
4. Under "Build and deployment" select:
   - Source: "Deploy from a branch"
   - Branch: "gh-pages" / "/(root)"
5. Click Save
6. Wait 5 minutes and your blog will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

### Adding a Custom Domain (GitHub Pages)

1. Go to your domain provider (e.g., GoDaddy, Namecheap)
2. Add these DNS records:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153

   Type: CNAME
   Host: www
   Value: YOUR_USERNAME.github.io
   ```
3. In your repository Settings > Pages:
   - Enter your domain in "Custom domain"
   - Click "Save"
   - Wait for DNS check to complete
   - Check "Enforce HTTPS"

## Quick Start for Vercel (Alternative)

1. Create a Vercel account
2. Fork this repository
3. Go to vercel.com/new
4. Choose "Import Git Repository" 
5. Find and select your forked repository
6. Click Deploy

### Adding a Custom Domain (Vercel)

1. Go to your project in Vercel
2. Click "Settings" > "Domains"
3. Add your domain name
4. Vercel will show you the required DNS records
5. Add these records at your domain provider
6. Wait for DNS to propagate (usually 15 minutes)

## Writing Blog Posts

1. Go to the `pages/posts` folder
2. Create a new file ending in `.mdx`
3. Add this at the top:
```
---
title: My Blog Post
date: 2024-01-09
description: A short description
---
```
4. Write your post using Markdown
5. Add the tip button at the bottom:
```
<CodeWallet />
```

## Adding Images & Videos

### Images
1. Put your image in the `public` folder
2. Add it to your post:
```
![Description](/your-image.jpg)
```

### YouTube Videos
1. Go to the YouTube video
2. Click Share > Embed
3. Copy the iframe code and paste in your post

## Getting Tips

1. Install Code Wallet on your phone
2. Create a `.env` file with:
```
NEXT_PUBLIC_CODE_WALLET_ADDRESS=your_wallet_address
NEXT_PUBLIC_CODE_WALLET_AMOUNT=0.05
```

## Need Help?

Check out the Example Post to see how everything works!

## License

MIT License - Feel free to use this for your own blog!

## Thanks to

* Next.js for the framework
* Nextra for the blog features
* Code Wallet for tipping