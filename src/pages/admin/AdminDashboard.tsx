import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileText, BookOpen, Code2, Users, TrendingUp, Eye, BarChart3, MessageCircle, Package, Activity, Globe } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useTutorials } from "@/hooks/useTutorials";
import { useCodeSnippets } from "@/hooks/useCodeSnippets";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useVisitorStats } from "@/hooks/useVisitorStats";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isAdmin, isSuperAdmin } = useUserRole();
  const { data: blogs } = useBlogPosts({ authorId: user?.id });
  const { data: tutorials } = useTutorials({ authorId: user?.id });
  const { data: snippets } = useCodeSnippets({ authorId: user?.id });
  const { data: visitorStats, isLoading: loadingVisitors } = useVisitorStats();

  // Fetch additional stats for admins
  const { data: adminStats } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalBlogs },
        { count: totalTutorials },
        { count: totalMessages },
        { count: totalMaterials },
        { count: todayLogins },
        { count: todaySignups },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("tutorials").select("*", { count: "exact", head: true }),
        supabase.from("community_messages").select("*", { count: "exact", head: true }),
        supabase.from("materials").select("*", { count: "exact", head: true }),
        supabase.from("user_activity_logs")
          .select("*", { count: "exact", head: true })
          .eq("action_type", "login")
          .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        supabase.from("user_activity_logs")
          .select("*", { count: "exact", head: true })
          .eq("action_type", "signup")
          .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
      ]);

      return {
        totalUsers: totalUsers || 0,
        totalBlogs: totalBlogs || 0,
        totalTutorials: totalTutorials || 0,
        totalMessages: totalMessages || 0,
        totalMaterials: totalMaterials || 0,
        todayLogins: todayLogins || 0,
        todaySignups: todaySignups || 0,
      };
    },
    enabled: isAdmin || isSuperAdmin,
  });

  const myStats = [
    {
      name: "My Blog Posts",
      value: blogs?.length || 0,
      published: blogs?.filter((b) => b.published).length || 0,
      icon: FileText,
      href: "/admin/blogs",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "My Tutorials",
      value: tutorials?.length || 0,
      published: tutorials?.filter((t) => t.published).length || 0,
      icon: BookOpen,
      href: "/admin/tutorials",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "My Snippets",
      value: snippets?.length || 0,
      published: snippets?.filter((s) => s.published).length || 0,
      icon: Code2,
      href: "/admin/snippets",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const platformStats = (isAdmin || isSuperAdmin) ? [
    {
      name: "Total Users",
      value: adminStats?.totalUsers || 0,
      icon: Users,
      href: "/admin/users",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      name: "All Blogs",
      value: adminStats?.totalBlogs || 0,
      icon: FileText,
      href: "/admin/blogs",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "All Tutorials",
      value: adminStats?.totalTutorials || 0,
      icon: BookOpen,
      href: "/admin/tutorials",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Materials",
      value: adminStats?.totalMaterials || 0,
      icon: Package,
      href: "/admin/materials",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      name: "Community Messages",
      value: adminStats?.totalMessages || 0,
      icon: MessageCircle,
      href: "/admin/community",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ] : [];

  return (
    <AdminLayout title="Dashboard" description="Overview of your content and platform activity">
      {/* Visitor Analytics - Real-time Stats */}
      {(isAdmin || isSuperAdmin) && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Visitor Analytics (Live)
            </h2>
            <Badge variant="outline" className="animate-pulse">
              <Activity className="h-3 w-3 mr-1" />
              Real-time
            </Badge>
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Today's Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{visitorStats?.todayViews || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {visitorStats?.todayUnique || 0} unique visitors
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{visitorStats?.weeklyViews || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">page views</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Total Unique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{visitorStats?.uniqueVisitors || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">unique sessions (30d)</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-orange-600">
                  {adminStats?.todayLogins || 0} logins
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {adminStats?.todaySignups || 0} new signups
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Traffic Chart */}
          {visitorStats?.dailyStats && visitorStats.dailyStats.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Weekly Traffic</CardTitle>
                <CardDescription>Page views and unique visitors over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitorStats.dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="views" fill="hsl(var(--primary))" name="Page Views" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="unique" fill="hsl(var(--secondary))" name="Unique Visitors" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Pages */}
          {visitorStats?.topPages && visitorStats.topPages.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Top Pages</CardTitle>
                <CardDescription>Most visited pages in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {visitorStats.topPages.slice(0, 5).map((page, index) => (
                    <div key={page.path} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground font-mono text-sm">#{index + 1}</span>
                        <span className="font-medium text-sm truncate max-w-[200px]">{page.path}</span>
                      </div>
                      <Badge variant="secondary">{page.count} views</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Admin Platform Stats */}
      {(isAdmin || isSuperAdmin) && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Platform Overview
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/analytics">
                View Analytics
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {platformStats.map((stat) => (
              <Card key={stat.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {stat.name}
                  </CardTitle>
                  <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <Button variant="link" asChild className="px-0 h-auto text-xs">
                    <Link to={stat.href}>Manage →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* My Content Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-heading font-semibold mb-4">My Content</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {myStats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.published} published
                </p>
                <Button variant="link" asChild className="px-0 mt-2">
                  <Link to={stat.href}>Manage →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-heading font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin/blogs">
              <FileText className="h-4 w-4 mr-2" />
              New Blog Post
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/admin/tutorials">
              <BookOpen className="h-4 w-4 mr-2" />
              New Tutorial
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/snippets">
              <Code2 className="h-4 w-4 mr-2" />
              New Snippet
            </Link>
          </Button>
          {(isAdmin || isSuperAdmin) && (
            <Button asChild variant="outline">
              <Link to="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Blogs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-heading">Recent Blog Posts</CardTitle>
            <CardDescription>Your latest blog activity</CardDescription>
          </CardHeader>
          <CardContent>
            {blogs && blogs.length > 0 ? (
              <div className="space-y-3">
                {blogs.slice(0, 5).map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="truncate flex-1">
                      <p className="font-medium truncate text-sm">{blog.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={blog.published ? "default" : "secondary"} className="text-xs">
                          {blog.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/blogs/${blog.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No blog posts yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Tutorials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-heading">Recent Tutorials</CardTitle>
            <CardDescription>Your latest tutorial activity</CardDescription>
          </CardHeader>
          <CardContent>
            {tutorials && tutorials.length > 0 ? (
              <div className="space-y-3">
                {tutorials.slice(0, 5).map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="truncate flex-1">
                      <p className="font-medium truncate text-sm">{tutorial.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={tutorial.published ? "default" : "secondary"} className="text-xs">
                          {tutorial.published ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {tutorial.difficulty} • {tutorial.estimated_minutes} min
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/tutorials/${tutorial.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No tutorials yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
