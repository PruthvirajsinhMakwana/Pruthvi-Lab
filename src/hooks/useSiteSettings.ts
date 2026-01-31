import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SEOSettings {
  site_title: string;
  site_description: string;
  site_keywords: string[];
  og_image: string;
  twitter_handle: string;
  google_analytics_id: string;
  robots_txt: string;
  favicon_url: string;
  pwa_name: string;
  pwa_short_name: string;
  pwa_description: string;
  pwa_theme_color: string;
  pwa_background_color: string;
}

const defaultSEOSettings: SEOSettings = {
  site_title: "Pruthvi's Lab - AI-Powered Learning Platform",
  site_description: "Learn coding with 400+ AI tools, free tutorials, code library, and AI Studio. Pruthvi's Lab is your ultimate destination for web development, programming, and AI-powered learning.",
  site_keywords: [
    "Pruthvi's Lab",
    "Pruthvis Lab", 
    "Pruthvi Lab",
    "coding tutorials",
    "AI tools",
    "programming",
    "web development",
    "learn coding",
    "free resources",
    "AI Studio",
    "code snippets",
    "React tutorials",
    "TypeScript",
    "JavaScript",
    "Python",
    "tech blog",
    "developer resources",
    "online learning",
    "coding courses"
  ],
  og_image: "https://storage.googleapis.com/gpt-engineer-file-uploads/Non3rSq4T8bdbryKgNSV1iGcTCf1/uploads/1768193796539-36366d841b786769c0038ca355f6839e.jpg",
  twitter_handle: "pruthvislab",
  google_analytics_id: "",
  robots_txt: "User-agent: *\nAllow: /\nSitemap: https://dev-api-learn.lovable.app/sitemap.xml",
  favicon_url: "https://storage.googleapis.com/gpt-engineer-file-uploads/Non3rSq4T8bdbryKgNSV1iGcTCf1/uploads/1768193796539-36366d841b786769c0038ca355f6839e.jpg",
  pwa_name: "Pruthvi's Lab - AI-Powered Learning Platform",
  pwa_short_name: "Pruthvi's Lab",
  pwa_description: "Learn coding with 400+ AI tools, tutorials, code library, and AI Studio",
  pwa_theme_color: "#8B5CF6",
  pwa_background_color: "#0F0A1F",
};

export function useSiteSettings() {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(defaultSEOSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "seo")
        .maybeSingle();

      if (error) throw error;

      if (data?.setting_value) {
        // Merge with defaults to ensure all fields exist
        setSeoSettings({
          ...defaultSEOSettings,
          ...(data.setting_value as unknown as SEOSettings)
        });
      }
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSEOSettings = async (newSettings: SEOSettings) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          setting_value: JSON.parse(JSON.stringify(newSettings)),
        })
        .eq("setting_key", "seo");

      if (error) throw error;

      setSeoSettings(newSettings);
      toast({
        title: "Settings Saved",
        description: "SEO settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      toast({
        title: "Error",
        description: "Failed to save SEO settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    seoSettings,
    loading,
    saving,
    updateSEOSettings,
    refetch: fetchSettings,
  };
}
