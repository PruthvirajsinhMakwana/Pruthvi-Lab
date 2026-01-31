import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";

interface VisitorStats {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  todayUnique: number;
  weeklyViews: number;
  monthlyViews: number;
  topPages: { path: string; count: number }[];
  dailyStats: { date: string; views: number; unique: number }[];
}

export function useVisitorStats() {
  return useQuery({
    queryKey: ["visitor-stats"],
    queryFn: async (): Promise<VisitorStats> => {
      const now = new Date();
      const todayStart = startOfDay(now).toISOString();
      const weekAgo = subDays(now, 7).toISOString();
      const monthAgo = subDays(now, 30).toISOString();

      // Fetch all page views for the last 30 days
      const { data: pageViews, error } = await supabase
        .from("page_views")
        .select("*")
        .gte("created_at", monthAgo)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const views = pageViews || [];

      // Calculate stats
      const todayViews = views.filter((v) => v.created_at >= todayStart);
      const weekViews = views.filter((v) => v.created_at >= weekAgo);

      // Unique visitors (by session_id)
      const uniqueSessions = new Set(views.map((v) => v.session_id));
      const todayUniqueSessions = new Set(todayViews.map((v) => v.session_id));

      // Top pages
      const pageCounts: Record<string, number> = {};
      views.forEach((v) => {
        pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Daily stats for the last 7 days
      const dailyStats: { date: string; views: number; unique: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const dayStart = startOfDay(subDays(now, i));
        const dayEnd = startOfDay(subDays(now, i - 1));
        const dayViews = views.filter(
          (v) => v.created_at >= dayStart.toISOString() && v.created_at < dayEnd.toISOString()
        );
        const dayUnique = new Set(dayViews.map((v) => v.session_id)).size;
        dailyStats.push({
          date: format(dayStart, "MMM dd"),
          views: dayViews.length,
          unique: dayUnique,
        });
      }

      return {
        totalViews: views.length,
        uniqueVisitors: uniqueSessions.size,
        todayViews: todayViews.length,
        todayUnique: todayUniqueSessions.size,
        weeklyViews: weekViews.length,
        monthlyViews: views.length,
        topPages,
        dailyStats,
      };
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}
