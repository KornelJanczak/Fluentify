import { Inter } from "next/font/google";
import { ThemeProvider } from "@/common/providers/theme-provider";
import "./globals.css";
import AuthProvider from "@/common/providers/auth-provider";
import { serverApi } from "@/common/api/server-api";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await serverApi.getSessionCookies();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />

      <body className={inter.className}>
        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
