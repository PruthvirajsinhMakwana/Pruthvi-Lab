import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Search, Activity, LogIn, LogOut, UserPlus, Edit, Trash, ShoppingCart, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface ActivityLogWithProfile extends ActivityLog {
  profile?: Profile;
}

const actionTypeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  login: { label: "Login", color: "bg-green-500/10 text-green-500", icon: <LogIn className="h-3 w-3" /> },
  logout: { label: "Logout", color: "bg-gray-500/10 text-gray-500", icon: <LogOut className="h-3 w-3" /> },
  signup: { label: "Sign Up", color: "bg-blue-500/10 text-blue-500", icon: <UserPlus className="h-3 w-3" /> },
  profile_update: { label: "Profile Update", color: "bg-yellow-500/10 text-yellow-500", icon: <Edit className="h-3 w-3" /> },
  password_reset: { label: "Password Reset", color: "bg-orange-500/10 text-orange-500", icon: <Edit className="h-3 w-3" /> },
  content_create: { label: "Content Create", color: "bg-purple-500/10 text-purple-500", icon: <Edit className="h-3 w-3" /> },
  content_update: { label: "Content Update", color: "bg-indigo-500/10 text-indigo-500", icon: <Edit className="h-3 w-3" /> },
  content_delete: { label: "Content Delete", color: "bg-red-500/10 text-red-500", icon: <Trash className="h-3 w-3" /> },
  purchase: { label: "Purchase", color: "bg-emerald-500/10 text-emerald-500", icon: <ShoppingCart className="h-3 w-3" /> },
  comment: { label: "Comment", color: "bg-cyan-500/10 text-cyan-500", icon: <MessageSquare className="h-3 w-3" /> },
  message: { label: "Message", color: "bg-pink-500/10 text-pink-500", icon: <MessageSquare className="h-3 w-3" /> },
};

export default function AdminActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      // Fetch activity logs
      const { data: logs, error: logsError } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (logsError) throw logsError;

      // Get unique user IDs
      const userIds = [...new Set(logs?.map(log => log.user_id) || [])];

      // Fetch profiles for those users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Map profiles to logs
      const profileMap = new Map(profiles?.map(p => [p.id, p]));
      
      return logs?.map(log => ({
        ...log,
        details: log.details as Record<string, unknown>,
        profile: profileMap.get(log.user_id),
      })) as ActivityLogWithProfile[];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-activity-stats'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: todayLogs, error: todayError } = await supabase
        .from('user_activity_logs')
        .select('id')
        .gte('created_at', today.toISOString());

      const { data: loginLogs, error: loginError } = await supabase
        .from('user_activity_logs')
        .select('id')
        .eq('action_type', 'login')
        .gte('created_at', today.toISOString());

      const { data: signupLogs, error: signupError } = await supabase
        .from('user_activity_logs')
        .select('id')
        .eq('action_type', 'signup')
        .gte('created_at', today.toISOString());

      if (todayError || loginError || signupError) throw todayError || loginError || signupError;

      return {
        todayActions: todayLogs?.length || 0,
        todayLogins: loginLogs?.length || 0,
        todaySignups: signupLogs?.length || 0,
      };
    },
  });

  const filteredLogs = activityLogs?.filter(log => {
    const matchesSearch = 
      log.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === "all" || log.action_type === actionFilter;

    return matchesSearch && matchesAction;
  });

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return '?';
  };

  const getActionBadge = (actionType: string) => {
    const config = actionTypeConfig[actionType] || { 
      label: actionType, 
      color: "bg-gray-500/10 text-gray-500",
      icon: <Activity className="h-3 w-3" />
    };
    return (
      <Badge variant="secondary" className={`${config.color} gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const formatDetails = (details: Record<string, unknown>) => {
    if (!details || Object.keys(details).length === 0) return null;
    return (
      <span className="text-xs text-muted-foreground">
        {Object.entries(details).map(([key, value]) => (
          <span key={key} className="mr-2">
            {key}: {String(value)}
          </span>
        ))}
      </span>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout title="Activity Logs" description="Track user activity and login history">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Activity Logs" description="Track user activity and login history">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Actions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.todayActions || 0}</div>
              <p className="text-xs text-muted-foreground">Total activities today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Logins</CardTitle>
              <LogIn className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.todayLogins || 0}</div>
              <p className="text-xs text-muted-foreground">User logins today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Signups</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.todaySignups || 0}</div>
              <p className="text-xs text-muted-foreground">New registrations today</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
            <CardDescription>View all user activities and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="signup">Sign Up</SelectItem>
                  <SelectItem value="profile_update">Profile Update</SelectItem>
                  <SelectItem value="content_create">Content Create</SelectItem>
                  <SelectItem value="content_update">Content Update</SelectItem>
                  <SelectItem value="content_delete">Content Delete</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="message">Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Activity Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No activity logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={log.profile?.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {getInitials(log.profile?.full_name, log.profile?.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {log.profile?.full_name || 'Unknown User'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {log.profile?.email || log.user_id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getActionBadge(log.action_type)}</TableCell>
                        <TableCell className="max-w-[200px]">
                          {formatDetails(log.details)}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px] block">
                            {log.user_agent?.split(' ')[0] || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {format(new Date(log.created_at), 'MMM d, yyyy')}
                          </span>
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), 'h:mm a')}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
