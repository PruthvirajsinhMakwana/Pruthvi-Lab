import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function SEOHead() {
  const { seoSettings, loading } = useSiteSettings();

  useEffect(() => {
    if (loading) return;

    // Update document title
    document.title = seoSettings.site_title || "Pruthvi's Lab";

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (content) {
        if (!element) {
          element = document.createElement("meta");
          if (selector.includes("property=")) {
            element.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
          } else if (selector.includes("name=")) {
            element.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
          }
          document.head.appendChild(element);
        }
        element.setAttribute(attribute, content);
      }
    };

    // Helper function to update or create link tags
    const updateLinkTag = (rel: string, href: string, additionalAttrs?: Record<string, string>) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (href) {
        if (!element) {
          element = document.createElement("link");
          element.setAttribute("rel", rel);
          document.head.appendChild(element);
        }
        element.setAttribute("href", href);
        if (additionalAttrs) {
          Object.entries(additionalAttrs).forEach(([key, value]) => {
            element!.setAttribute(key, value);
          });
        }
      }
    };

    // Update basic meta tags
    updateMetaTag('meta[name="description"]', "content", seoSettings.site_description);
    updateMetaTag('meta[name="keywords"]', "content", seoSettings.site_keywords.join(", "));
    updateMetaTag('meta[name="author"]', "content", seoSettings.site_title);

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', "content", seoSettings.site_title);
    updateMetaTag('meta[property="og:description"]', "content", seoSettings.site_description);
    updateMetaTag('meta[property="og:image"]', "content", seoSettings.og_image);
    updateMetaTag('meta[property="og:type"]', "content", "website");

    // Update Twitter tags
    updateMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    updateMetaTag('meta[name="twitter:title"]', "content", seoSettings.site_title);
    updateMetaTag('meta[name="twitter:description"]', "content", seoSettings.site_description);
    updateMetaTag('meta[name="twitter:image"]', "content", seoSettings.og_image);
    if (seoSettings.twitter_handle) {
      updateMetaTag('meta[name="twitter:site"]', "content", `@${seoSettings.twitter_handle.replace("@", "")}`);
    }

    // Update PWA theme color
    updateMetaTag('meta[name="theme-color"]', "content", seoSettings.pwa_theme_color);

    // Update favicon
    if (seoSettings.favicon_url) {
      updateLinkTag("icon", seoSettings.favicon_url);
      updateLinkTag("apple-touch-icon", seoSettings.favicon_url);
    }

    // Update or create manifest link
    const manifestData = {
      name: seoSettings.pwa_name || seoSettings.site_title,
      short_name: seoSettings.pwa_short_name || seoSettings.site_title,
      description: seoSettings.pwa_description || seoSettings.site_description,
      theme_color: seoSettings.pwa_theme_color,
      background_color: seoSettings.pwa_background_color,
      display: "standalone",
      start_url: "/",
      icons: seoSettings.favicon_url ? [
        {
          src: seoSettings.favicon_url,
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: seoSettings.favicon_url,
          sizes: "512x512",
          type: "image/png"
        }
      ] : []
    };

    // Create blob URL for manifest
    const manifestBlob = new Blob([JSON.stringify(manifestData)], { type: "application/json" });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    if (!manifestLink) {
      manifestLink = document.createElement("link");
      manifestLink.setAttribute("rel", "manifest");
      document.head.appendChild(manifestLink);
    }
    manifestLink.setAttribute("href", manifestUrl);

    // Add Google Analytics if configured
    if (seoSettings.google_analytics_id) {
      const existingScript = document.querySelector(`script[src*="googletagmanager"]`);
      if (!existingScript) {
        const gtagScript = document.createElement("script");
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${seoSettings.google_analytics_id}`;
        document.head.appendChild(gtagScript);

        const inlineScript = document.createElement("script");
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${seoSettings.google_analytics_id}');
        `;
        document.head.appendChild(inlineScript);
      }
    }

    // Cleanup function
    return () => {
      URL.revokeObjectURL(manifestUrl);
    };
  }, [seoSettings, loading]);

  return null;
}
