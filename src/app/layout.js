import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Navbar from '@/components/Navbar';
import "./globals.css";

export const metadata = {
  title: "Fix Acum",
  description: "O platforma pentru muncitori si proprietarii de case",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <AuthProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            <Navbar />
            <main className="flex-1 w-full transition-all duration-300 ease-in-out md:pl-[2rem] lg:pl-[4rem]">
              {children}
              <SpeedInsights />
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
