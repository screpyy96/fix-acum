import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: "Fix Acum",
  description: "O platforma pentru muncitori si proprietarii de case",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto mt-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
