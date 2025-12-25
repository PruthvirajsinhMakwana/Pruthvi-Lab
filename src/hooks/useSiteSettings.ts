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
}

const defaultSEOSettings: SEOSettings = {
  site_title: "Pruthvi's Lab",
  site_description: "Learn coding, explore tutorials, and discover resources at Pruthvi's Lab",
  site_keywords: ["coding", "tutorials", "programming", "web development", "learning"],
  og_image: "",
  twitter_handle: "",
  google_analytics_id: "",
  robots_txt: "User-agent: *\nAllow: /",
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
        setSeoSettings(data.setting_value as unknown as SEOSettings);
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
