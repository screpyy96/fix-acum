import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: "Fix Acum",
  description: "O platforma pentru muncitori si proprietarii de case",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
