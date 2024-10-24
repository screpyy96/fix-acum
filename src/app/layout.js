import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import GoogleMapsScript from '@/components/googlePlaces/GoogleMapsScript';
 import { Analytics } from "@vercel/analytics/react"
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: "Fix Acum",
  description: "O platforma pentru muncitori si proprietarii de case",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <Head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P7LD6FBK');
          `
        }} />
      </Head>
      <AuthProvider>
        <body className={inter.className}>
          <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P7LD6FBK"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
          </noscript>
          {children}
          <Navbar />
          <GoogleMapsScript />
          <Analytics />
        </body>
      </AuthProvider>
    </html>
  );
}
