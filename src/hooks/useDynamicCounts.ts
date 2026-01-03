import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DynamicCounts {
  tutorials: number;
  snippets: number;
  blogs: number;
  users: number;
  materials: number;
}

export function useDynamicCounts() {
  return useQuery({
    queryKey: ["dynamic-counts"],
    queryFn: async (): Promise<DynamicCounts> => {
      const [
        tutorialsResult,
        snippetsResult,
        blogsResult,
        materialsResult,
      ] = await Promise.all([
        supabase.from("tutorials").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("code_snippets").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("materials").select("id", { count: "exact", head: true }).eq("published", true),
      ]);

      return {
        tutorials: tutorialsResult.count || 0,
        snippets: snippetsResult.count || 0,
        blogs: blogsResult.count || 0,
        users: 0, // Can't count users from client, estimated
        materials: materialsResult.count || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Format number with + suffix
export function formatCount(count: number, suffix: string = "+"): string {
  if (count === 0) return "0";
  if (count < 10) return `${count}${suffix}`;
  if (count < 100) return `${Math.floor(count / 10) * 10}${suffix}`;
  return `${Math.floor(count / 100) * 100}${suffix}`;
}
