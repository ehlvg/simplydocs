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
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        ></link>
        <meta name="apple-mobile-web-app-title" content="simply.doc" />
        <meta name="mobile-web-app-capable" content="yes"></meta>
        <meta name="apple-mobile-wep-app-capable" content="yes"></meta>
      </head>
      <body className={`${sofiaSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="docs-theme"
        >
          {children}
        </ThemeProvider>
        <script src="https://cdn.jsdelivr.net/npm/marked-footnote/dist/index.umd.min.js"></script>
      </body>
    </html>
  );
}
