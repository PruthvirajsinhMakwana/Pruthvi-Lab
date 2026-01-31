import { useEffect } from "react";

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export function PageSEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  noindex = false,
}: PageSEOProps) {
  useEffect(() => {
    const siteName = "Pruthvi's Lab";
    const baseUrl = "https://dev-api-learn.lovable.app";
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    const pageUrl = url || window.location.href;
    const defaultImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/Non3rSq4T8bdbryKgNSV1iGcTCf1/uploads/1768193796539-36366d841b786769c0038ca355f6839e.jpg";
    const pageImage = image || defaultImage;

    // Update title
    document.title = fullTitle;

    // Helper to update/create meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Basic meta tags
    setMeta("name", "description", description);
    setMeta("name", "keywords", [...keywords, "Pruthvi's Lab", "Pruthvis Lab", "coding", "tutorials", "AI tools"].join(", "));
    setMeta("name", "author", author || "Pruthvirajsinh Makwana");
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", pageImage);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", siteName);
    setMeta("property", "og:locale", "en_US");

    // Twitter Card
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", pageImage);
    setMeta("name", "twitter:site", "@pruthvislab");

    // Article specific
    if (type === "article") {
      if (author) setMeta("property", "article:author", author);
      if (publishedTime) setMeta("property", "article:published_time", publishedTime);
      if (modifiedTime) setMeta("property", "article:modified_time", modifiedTime);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, noindex]);

  return null;
}
