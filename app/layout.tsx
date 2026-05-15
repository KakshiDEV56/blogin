import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SearchModal } from "@/components/search/SearchModal";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: "blogin",
  description: "systems programmer's notebook",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

import { SearchTrigger } from "@/components/search/SearchTrigger";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        jetbrainsMono.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          storageKey="blogin-theme"
        >
          <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[60] flex items-center gap-1 md:gap-2 transition-all">
            <SearchTrigger />
            <ThemeToggle />
          </div>
          {children}
          <SearchModal />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
