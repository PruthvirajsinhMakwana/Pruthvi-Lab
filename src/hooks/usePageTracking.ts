import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Generate a session ID for anonymous tracking
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("visitor_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("visitor_session_id", sessionId);
  }
  return sessionId;
};

export function usePageTracking() {
  const location = useLocation();
  const { user } = useAuth();
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    // Avoid tracking the same path twice in a row
    if (lastTrackedPath.current === location.pathname) return;
    lastTrackedPath.current = location.pathname;

    const trackPageView = async () => {
      try {
        await supabase.from("page_views").insert({
          page_path: location.pathname,
          user_id: user?.id || null,
          session_id: getSessionId(),
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });
      } catch (error) {
        // Silently fail - analytics shouldn't break the app
        console.error("Failed to track page view:", error);
      }
    };

    trackPageView();
  }, [location.pathname, user?.id]);
}
