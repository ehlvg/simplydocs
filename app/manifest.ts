import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "simply.doc - Elegant writing tool",
    short_name: "simply.doc",
    description: "Elegant writing tool",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e88e5",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
