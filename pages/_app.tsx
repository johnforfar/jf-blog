import type { AppProps } from 'next/app'
import React from 'react'
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
  return (
    <main className={`${geistSans.variable} ${geistMono.variable}`}>
      <Component {...pageProps} />
    </main>
  )
}

export default App