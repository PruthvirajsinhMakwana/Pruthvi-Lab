import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Users,
  Ban,
  Shield,
  Trash2,
  Loader2,
  Calendar,
  ShieldOff,
} from "lucide-react";
import { format } from "date-fns";

interface BlockedUser {
  id: string;
  user_id: string;
  blocked_by: string;
  reason: string | null;
  created_at: string;
  profile?: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}

export default function AdminCommunity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBlockedUser, setSelectedBlockedUser] = useState<BlockedUser | null>(null);
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false);

  // Fetch community stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-community-stats"],
    queryFn: async () => {
      const [
        { count: totalMessages },
        { count: totalReactions },
        { count: blockedUsers },
      ] = await Promise.all([
        supabase.from("community_messages").select("*", { count: "exact", head: true }),
        supabase.from("message_reactions").select("*", { count: "exact", head: true }),
        supabase.from("chat_blocked_users").select("*", { count: "exact", head: true }),
      ]);

      return {
        totalMessages: totalMessages || 0,
        totalReactions: totalReactions || 0,
        blockedUsers: blockedUsers || 0,
      };
    },
  });

  // Fetch blocked users
  const { data: blockedUsers, isLoading: blockedLoading } = useQuery({
    queryKey: ["admin-blocked-users"],
    queryFn: async () => {
      const { data: blocked, error } = await supabase
        .from("chat_blocked_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for blocked users
      const userIds = blocked?.map((b) => b.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .in("id", userIds);

      const blockedWithProfiles: BlockedUser[] = (blocked || []).map((b) => ({
        ...b,
        profile: profiles?.find((p) => p.id === b.user_id),
      }));

      return blockedWithProfiles;
    },
  });

  // Unblock user mutation
  const unblockMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("chat_blocked_users")
        .delete()
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blocked-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-community-stats"] });
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
      toast({
        title: "User unblocked",
        description: "User can now send messages in the community chat.",
      });
      setIsUnblockDialogOpen(false);
      setSelectedBlockedUser(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unblock user.",
        variant: "destructive",
      });
    },
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

  const openUnblockDialog = (user: BlockedUser) => {
    setSelectedBlockedUser(user);
    setIsUnblockDialogOpen(true);
  };

  return (
    <AdminLayout title="Community Management" description="Manage community chat and blocked users">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Messages
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reactions
            </CardTitle>
            <span className="text-lg">👍</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReactions || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Blocked Users
            </CardTitle>
            <Ban className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.blockedUsers || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Blocked Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Blocked Users
          </CardTitle>
          <CardDescription>Users who are blocked from sending messages</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {blockedLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : blockedUsers && blockedUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Reason</TableHead>
                    <TableHead className="hidden sm:table-cell">Blocked At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedUsers.map((blocked) => (
                    <TableRow key={blocked.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-2 border-destructive">
                            <AvatarImage src={blocked.profile?.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {getInitials(blocked.profile?.full_name, blocked.profile?.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {blocked.profile?.full_name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {blocked.profile?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {blocked.reason || "No reason provided"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(blocked.created_at), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUnblockDialog(blocked)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <ShieldOff className="h-4 w-4 mr-1" />
                          Unblock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No blocked users</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unblock Dialog */}
      <Dialog open={isUnblockDialogOpen} onOpenChange={setIsUnblockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unblock User</DialogTitle>
            <DialogDescription>
              Are you sure you want to unblock {selectedBlockedUser?.profile?.full_name || "this user"}?
              They will be able to send messages in the community chat again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUnblockDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedBlockedUser && unblockMutation.mutate(selectedBlockedUser.user_id)}
              disabled={unblockMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {unblockMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ShieldOff className="h-4 w-4 mr-2" />
              )}
              Unblock User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
