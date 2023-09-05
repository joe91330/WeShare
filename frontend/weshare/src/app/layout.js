/* eslint-disable @next/next/no-head-element */
/* eslint-disable react/prop-types */
import Head from 'next/head';  // 從Next.js匯入Head組件
import './globals.css';

export const metadata = {
  title: 'Weshare',
  description: '',
  image: '/logo.png', 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>
    <link rel="icon" href="/logo.png" type="image/png" /> 
      <body>{children}</body>
    </html>
  )
}
