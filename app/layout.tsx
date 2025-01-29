import type { Metadata } from "next";
import { Sofia_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import "./preview.css";

const sofiaSans = Sofia_Sans({
  variable: "--font-sofia-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "simply.doc",
  description: "Elegant writing tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sofiaSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="docs-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
