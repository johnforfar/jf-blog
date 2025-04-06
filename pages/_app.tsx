import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import { Geist, Geist_Mono } from "next/font/google"
import "../styles/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    // Force all images to be properly sized when the page loads
    const forceProperImageSizing = () => {
      console.log('Enforcing proper image sizing for all blog card images');
      
      // Get all article elements
      const articles = document.querySelectorAll('article');
      
      articles.forEach(article => {
        // Get the image container
        const imageContainer = article.querySelector('a');
        if (imageContainer) {
          // Ensure the container has proper styles
          imageContainer.style.position = 'relative';
          imageContainer.style.height = '0';
          imageContainer.style.paddingBottom = '56.25%';
          imageContainer.style.width = '100%';
          imageContainer.style.overflow = 'hidden';
          
          // Get the image
          const image = imageContainer.querySelector('img');
          if (image) {
            // Force the image to have proper styles
            image.style.position = 'absolute';
            image.style.top = '0';
            image.style.left = '0';
            image.style.width = '100%';
            image.style.height = '100%';
            image.style.objectFit = 'cover';
            image.style.objectPosition = 'center';
            image.style.maxWidth = '100%';
            image.style.maxHeight = '100%';
            image.style.minWidth = '100%';
            image.style.minHeight = '100%';
            
            // Special handling for Reddit image
            if (image.src.includes('Reddit') || 
                image.src.includes('reddit') || 
                image.src.includes('bake-off') || 
                image.src.endsWith('1.png')) {
              console.log('Extra styling for Reddit image:', image.src);
              image.style.transform = 'none';
            }
          }
        }
      });
    };
    
    // Run on initial load
    forceProperImageSizing();
    
    // Also run after a short delay to catch any dynamically loaded images
    const timeoutId = setTimeout(forceProperImageSizing, 1000);
    
    // And run when images load
    window.addEventListener('load', forceProperImageSizing);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('load', forceProperImageSizing);
    };
  }, []);
  
  return (
    <main className={`${geistSans.variable} ${geistMono.variable}`}>
      <Component {...pageProps} />
    </main>
  )
}

export default App