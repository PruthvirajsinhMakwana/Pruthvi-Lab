import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  FileText,
  BookOpen,
  Code2,
  MessageCircle,
  TrendingUp,
  Activity,
  Package,
  Loader2,
} from "lucide-react";
import { format, subDays } from "date-fns";

export default function AdminAnalytics() {
  // Fetch all analytics data
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalBlogs },
        { count: publishedBlogs },
        { count: totalTutorials },
        { count: publishedTutorials },
        { count: totalSnippets },
        { count: publishedSnippets },
        { count: totalMaterials },
        { count: totalMessages },
        { count: totalComments },
        { data: recentUsers },
        { data: recentBlogs },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("tutorials").select("*", { count: "exact", head: true }),
        supabase.from("tutorials").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("code_snippets").select("*", { count: "exact", head: true }),
        supabase.from("code_snippets").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("materials").select("*", { count: "exact", head: true }),
        supabase.from("community_messages").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("id, full_name, email, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("blog_posts").select("id, title, created_at, published").order("created_at", { ascending: false }).limit(5),
      ]);

      // Get users joined in last 7 days
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      const { count: newUsersThisWeek } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo);

      return {
        totalUsers: totalUsers || 0,
        newUsersThisWeek: newUsersThisWeek || 0,
        totalBlogs: totalBlogs || 0,
        publishedBlogs: publishedBlogs || 0,
        totalTutorials: totalTutorials || 0,
        publishedTutorials: publishedTutorials || 0,
        totalSnippets: totalSnippets || 0,
        publishedSnippets: publishedSnippets || 0,
        totalMaterials: totalMaterials || 0,
        totalMessages: totalMessages || 0,
        totalComments: totalComments || 0,
        recentUsers: recentUsers || [],
        recentBlogs: recentBlogs || [],
      };
    },
  });

  if (isLoading) {
    return (
      <AdminLayout title="Analytics" description="Platform statistics and insights">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const overviewStats = [
    {
      name: "Total Users",
      value: stats?.totalUsers || 0,
      subtext: `+${stats?.newUsersThisWeek || 0} this week`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Blog Posts",
      value: stats?.totalBlogs || 0,
      subtext: `${stats?.publishedBlogs || 0} published`,
      icon: FileText,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Tutorials",
      value: stats?.totalTutorials || 0,
      subtext: `${stats?.publishedTutorials || 0} published`,
      icon: BookOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      name: "Code Snippets",
      value: stats?.totalSnippets || 0,
      subtext: `${stats?.publishedSnippets || 0} published`,
      icon: Code2,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      name: "Materials",
      value: stats?.totalMaterials || 0,
      subtext: "Learning resources",
      icon: Package,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      name: "Community Messages",
      value: stats?.totalMessages || 0,
      subtext: `${stats?.totalComments || 0} comments`,
      icon: MessageCircle,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <AdminLayout title="Analytics" description="Platform statistics and insights">
      {/* Overview Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 mb-8">
        {overviewStats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Users
            </CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              <div className="space-y-3">
                {stats.recentUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{user.full_name || "No name"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(user.created_at), "MMM d")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No recent users</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Blog Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Blog Posts
            </CardTitle>
            <CardDescription>Latest blog activity</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentBlogs && stats.recentBlogs.length > 0 ? (
              <div className="space-y-3">
                {stats.recentBlogs.map((blog: any) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{blog.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {blog.published ? "Published" : "Draft"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {format(new Date(blog.created_at), "MMM d")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No recent blogs</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Platform Overview
          </CardTitle>
          <CardDescription>Content distribution summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">{stats?.publishedBlogs || 0}</p>
              <p className="text-xs text-muted-foreground">Published Blogs</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">{stats?.publishedTutorials || 0}</p>
              <p className="text-xs text-muted-foreground">Published Tutorials</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">{stats?.publishedSnippets || 0}</p>
              <p className="text-xs text-muted-foreground">Published Snippets</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">{stats?.totalUsers || 0}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
