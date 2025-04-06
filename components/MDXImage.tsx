// Create components/MDXImage.tsx
import Image from 'next/image';
import React from 'react';

const getBaseUrl = () => {
  return typeof window === 'undefined'
    ? process.env.BACKEND_URL || 'http://localhost:3001'
    : '';
};

export const MDXImage = (props: {
  src: string;
  alt?: string;
}) => {
  // Fix image paths that might come from the MDX
  const imageUrl = props.src.startsWith('./images/') 
    ? `${getBaseUrl()}${props.src.replace('./images/', '/images/')}`
    : props.src;
    
  // Use Next.js Image but with fixed display style to avoid nesting problems
  return (
    <span className="inline-block my-6">
      <Image 
        src={imageUrl}
        alt={props.alt || ''}
        width={800}
        height={450}
        style={{ maxWidth: '100%', height: 'auto' }}
        className="rounded-md"
      />
    </span>
  );
};