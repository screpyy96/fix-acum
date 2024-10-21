import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: "Fix Acum",
  description: "O platforma pentru muncitori si proprietarii de case",
};

export default function RootLayout({ children }) {
  console.log('RootLayout rendering');
  return (
    <html lang="en" className={inter.className}>
        <AuthProvider>
      <body className={inter.className}>
         {console.log('Body rendering')}
            {children}
         <Navbar />
      </body>
        </AuthProvider>
    </html>
  );
}
