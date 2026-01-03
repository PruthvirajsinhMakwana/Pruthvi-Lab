import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Users,
  Shield,
  ShieldCheck,
  User,
  Mail,
  Calendar,
  MoreVertical,
  Loader2,
  Ban,
  CheckCircle,
  UserX,
  AlertTriangle,
  Send,
  Copy,
  Key,
  Activity,
  Globe,
  Monitor,
  Eye,
  EyeOff,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

interface UserWithRole {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  role: string;
  isBanned: boolean;
  banReason?: string | null;
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

export default function AdminUsers() {
  const { isSuperAdmin, isAdmin } = useUserRole();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  
  // Password reset state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Activity view state
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [viewingUserActivity, setViewingUserActivity] = useState<UserWithRole | null>(null);
  
  // Bulk email state
  const [isBulkEmailDialogOpen, setIsBulkEmailDialogOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  // Fetch all users with their roles and ban status
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const { data: blockedUsers, error: blockedError } = await supabase
        .from("chat_blocked_users")
        .select("user_id, reason");

      if (blockedError) throw blockedError;

      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.id);
        const blocked = blockedUsers?.find((b) => b.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "user",
          isBanned: !!blocked,
          banReason: blocked?.reason,
        };
      });

      return usersWithRoles;
    },
  });

  // Fetch user activity logs
  const { data: userActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["user-activity", viewingUserActivity?.id],
    queryFn: async () => {
      if (!viewingUserActivity) return [];
      const { data, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .eq("user_id", viewingUserActivity.id)
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as ActivityLog[];
    },
    enabled: !!viewingUserActivity,
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingRole) {
        const { error } = await supabase
          .from("user_roles")
          .update({ role })
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user role. You may not have permission.",
        variant: "destructive",
      });
    },
  });

  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { error } = await supabase
        .from("chat_blocked_users")
        .insert({
          user_id: userId,
          blocked_by: currentUser?.id,
          reason: reason || "Banned by admin",
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "User banned",
        description: "User has been banned successfully.",
      });
      setIsBanDialogOpen(false);
      setSelectedUser(null);
      setBanReason("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to ban user.",
        variant: "destructive",
      });
    },
  });

  // Unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("chat_blocked_users")
        .delete()
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "User unbanned",
        description: "User has been unbanned successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unban user.",
        variant: "destructive",
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      const { data, error } = await supabase.functions.invoke("admin-reset-password", {
        body: { userId, newPassword },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Password Reset",
        description: "User password has been updated successfully.",
      });
      setIsPasswordDialogOpen(false);
      setSelectedUser(null);
      setNewPassword("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password.",
        variant: "destructive",
      });
    },
  });

  // Bulk email mutation
  const bulkEmailMutation = useMutation({
    mutationFn: async ({ emails, subject, htmlContent }: { emails: string[]; subject: string; htmlContent: string }) => {
      const { data, error } = await supabase.functions.invoke("send-bulk-email", {
        body: { emails, subject, htmlContent },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Bulk email sent",
        description: `Successfully sent to ${data.success} users. ${data.failed > 0 ? `Failed: ${data.failed}` : ""}`,
      });
      setIsBulkEmailDialogOpen(false);
      setSelectedEmails([]);
      setEmailSubject("");
      setEmailContent("");
      setSelectAll(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send bulk email.",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "banned" && user.isBanned) ||
      (statusFilter === "active" && !user.isBanned);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
        );
      case "admin":
        return (
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <User className="h-3 w-3 mr-1" />
            User
          </Badge>
        );
    }
  };

  const getActionBadge = (actionType: string) => {
    const config: Record<string, { color: string; label: string }> = {
      login: { color: "bg-green-500/10 text-green-600", label: "Login" },
      logout: { color: "bg-gray-500/10 text-gray-600", label: "Logout" },
      signup: { color: "bg-blue-500/10 text-blue-600", label: "Signup" },
      page_view: { color: "bg-purple-500/10 text-purple-600", label: "Page View" },
      admin_password_reset: { color: "bg-red-500/10 text-red-600", label: "Password Reset" },
    };
    const { color, label } = config[actionType] || { color: "bg-gray-500/10 text-gray-600", label: actionType };
    return <Badge className={color}>{label}</Badge>;
  };

  const getBrowserInfo = (userAgent: string | null) => {
    if (!userAgent) return "Unknown";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Other";
  };

  const openRoleDialog = (user: UserWithRole) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const openBanDialog = (user: UserWithRole) => {
    setSelectedUser(user);
    setBanReason("");
    setIsBanDialogOpen(true);
  };

  const openPasswordDialog = (user: UserWithRole) => {
    setSelectedUser(user);
    setNewPassword("");
    setShowPassword(false);
    setIsPasswordDialogOpen(true);
  };

  const openActivityDialog = (user: UserWithRole) => {
    setViewingUserActivity(user);
    setIsActivityDialogOpen(true);
  };

  const handleRoleUpdate = () => {
    if (selectedUser && newRole) {
      updateRoleMutation.mutate({ userId: selectedUser.id, role: newRole });
    }
  };

  const handleBanUser = () => {
    if (selectedUser) {
      banUserMutation.mutate({ userId: selectedUser.id, reason: banReason });
    }
  };

  const handleUnbanUser = (userId: string) => {
    unbanUserMutation.mutate(userId);
  };

  const handleResetPassword = () => {
    if (selectedUser && newPassword) {
      resetPasswordMutation.mutate({ userId: selectedUser.id, newPassword });
    }
  };

  const toggleEmailSelection = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allEmails = filteredUsers?.filter(u => u.email).map(u => u.email!) || [];
      setSelectedEmails(allEmails);
    } else {
      setSelectedEmails([]);
    }
  };

  const copyAllEmails = () => {
    const emails = users?.filter(u => u.email).map(u => u.email).join(", ") || "";
    navigator.clipboard.writeText(emails);
    toast({
      title: "Copied!",
      description: `${users?.filter(u => u.email).length || 0} emails copied to clipboard.`,
    });
  };

  const handleSendBulkEmail = () => {
    if (selectedEmails.length === 0) {
      toast({
        title: "No recipients",
        description: "Please select at least one user to send email.",
        variant: "destructive",
      });
      return;
    }
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast({
        title: "Missing content",
        description: "Please enter subject and email content.",
        variant: "destructive",
      });
      return;
    }

    const htmlContent = emailContent.includes("<") 
      ? emailContent 
      : `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">${emailSubject}</h2>
          <div style="color: #555; line-height: 1.6;">${emailContent.replace(/\n/g, "<br>")}</div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">This email was sent from CodeNest Admin.</p>
        </div>`;

    bulkEmailMutation.mutate({ 
      emails: selectedEmails, 
      subject: emailSubject, 
      htmlContent 
    });
  };

  const stats = {
    total: users?.length || 0,
    admins: users?.filter((u) => u.role === "admin" || u.role === "super_admin").length || 0,
    users: users?.filter((u) => u.role === "user").length || 0,
    banned: users?.filter((u) => u.isBanned).length || 0,
  };

  return (
    <AdminLayout title="User Management" description="Manage users, passwords, roles, and track activity">
      {/* Security Notice */}
      <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-600">Security Information</h4>
              <p className="text-sm text-muted-foreground">
                Passwords are securely hashed and cannot be viewed. Admins can <strong>reset passwords</strong> for users who need access. 
                All password resets are logged for security auditing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Admins
            </CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regular Users
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Banned Users
            </CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.banned}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          onClick={() => setIsBulkEmailDialogOpen(true)}
          className="gap-2"
          disabled={!users || users.length === 0}
        >
          <Send className="h-4 w-4" />
          Send Bulk Email
        </Button>
        <Button 
          variant="outline" 
          onClick={copyAllEmails}
          className="gap-2"
          disabled={!users || users.length === 0}
        >
          <Copy className="h-4 w-4" />
          Copy All Emails
        </Button>
        {selectedEmails.length > 0 && (
          <Badge variant="secondary" className="py-2">
            {selectedEmails.length} selected
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="super_admin">Super Admins</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Joined</TableHead>
                    {(isSuperAdmin || isAdmin) && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className={user.isBanned ? "bg-red-500/5" : ""}>
                        <TableCell>
                          <Checkbox 
                            checked={user.email ? selectedEmails.includes(user.email) : false}
                            onCheckedChange={() => user.email && toggleEmailSelection(user.email)}
                            disabled={!user.email}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {getInitials(user.full_name, user.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm flex items-center gap-2">
                                {user.full_name || "No name"}
                                {user.isBanned && (
                                  <UserX className="h-3 w-3 text-red-500" />
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground md:hidden">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <Badge variant="destructive" className="gap-1">
                              <Ban className="h-3 w-3" />
                              Banned
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(user.created_at), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        {(isSuperAdmin || isAdmin) && (
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openActivityDialog(user)}>
                                  <Activity className="h-4 w-4 mr-2" />
                                  View Activity
                                </DropdownMenuItem>
                                {isSuperAdmin && (
                                  <>
                                    <DropdownMenuItem onClick={() => openPasswordDialog(user)}>
                                      <Key className="h-4 w-4 mr-2" />
                                      Reset Password
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                                      <Shield className="h-4 w-4 mr-2" />
                                      Change Role
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuSeparator />
                                {user.isBanned ? (
                                  <DropdownMenuItem 
                                    onClick={() => handleUnbanUser(user.id)}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Unban User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => openBanDialog(user)}
                                    className="text-red-600"
                                    disabled={user.role === "super_admin" || user.role === "admin"}
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Ban User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Update Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleUpdate} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The user will need to use this password to log in. Share it securely.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleResetPassword} 
              disabled={resetPasswordMutation.isPending || newPassword.length < 6}
            >
              {resetPasswordMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Activity Dialog */}
      <Dialog open={isActivityDialogOpen} onOpenChange={(open) => {
        setIsActivityDialogOpen(open);
        if (!open) setViewingUserActivity(null);
      }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              User Activity - {viewingUserActivity?.full_name || viewingUserActivity?.email}
            </DialogTitle>
            <DialogDescription>
              View login history, IP addresses, and activity logs
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {activityLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : userActivity && userActivity.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivity.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{getActionBadge(log.action_type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          {log.ip_address || "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Monitor className="h-3 w-3" />
                          {getBrowserInfo(log.user_agent)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No activity logs found for this user.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Ban User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {selectedUser?.full_name || selectedUser?.email}? 
              They will not be able to access certain features.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ban-reason">Reason for ban (optional)</Label>
              <Textarea
                id="ban-reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter the reason for banning this user..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleBanUser} 
              disabled={banUserMutation.isPending}
            >
              {banUserMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Email Dialog */}
      <Dialog open={isBulkEmailDialogOpen} onOpenChange={setIsBulkEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Bulk Email
            </DialogTitle>
            <DialogDescription>
              Send an email to {selectedEmails.length > 0 ? `${selectedEmails.length} selected users` : "all users"}. 
              Select users from the table or send to all.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">
                {selectedEmails.length > 0 ? selectedEmails.length : users?.filter(u => u.email).length || 0} recipients
              </Badge>
              {selectedEmails.length === 0 && (
                <span className="text-xs">(Will send to all users if none selected)</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject *</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-content">Email Content *</Label>
              <Textarea
                id="email-content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Enter your email message... (HTML supported)"
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                You can use plain text or HTML. Plain text will be automatically formatted.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedEmails.length === 0) {
                  const allEmails = users?.filter(u => u.email).map(u => u.email!) || [];
                  setSelectedEmails(allEmails);
                  setTimeout(handleSendBulkEmail, 100);
                } else {
                  handleSendBulkEmail();
                }
              }} 
              disabled={bulkEmailMutation.isPending}
              className="gap-2"
            >
              {bulkEmailMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
