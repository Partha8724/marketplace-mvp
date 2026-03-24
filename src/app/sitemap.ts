import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "http://localhost:3000";

  return [
    "",
    "/browse",
    "/how-it-works",
    "/safety",
    "/prohibited-items",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
