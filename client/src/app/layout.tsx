import { Inter } from "next/font/google";
import { ThemeProvider } from "@/common/providers/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import TanstackQueryProvider from "@/common/providers/tanstack-query-provider";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <TanstackQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}

            <Toaster position="top-center" />
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
