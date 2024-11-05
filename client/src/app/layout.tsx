// client/src/app/layout.tsx

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <div className="flex min-h-screen flex-col items-center p-24">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
