import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Mail, 
  Users, 
  Send, 
  FileText, 
  Plus, 
  Eye,
  Loader2,
  Phone,
  User,
  Search,
  Download,
  RefreshCw,
  Trash2,
  Edit
} from "lucide-react";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  source: string;
  subscribed: boolean;
  created_at: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  category: string;
  created_at: string;
}

interface Campaign {
  id: string;
  subject: string;
  recipients_count: number;
  status: string;
  sent_at: string | null;
  created_at: string;
}

const AdminMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, templatesRes, campaignsRes] = await Promise.all([
        supabase.from("marketing_subscribers").select("*").order("created_at", { ascending: false }),
        supabase.from("email_templates").select("*").order("created_at", { ascending: false }),
        supabase.from("email_campaigns").select("*").order("created_at", { ascending: false }),
      ]);

      if (subsRes.data) setSubscribers(subsRes.data as Subscriber[]);
      if (templatesRes.data) setTemplates(templatesRes.data as EmailTemplate[]);
      if (campaignsRes.data) setCampaigns(campaignsRes.data as Campaign[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setComposeSubject(template.subject);
    setComposeContent(template.html_content);
  };

  const handleSendBulkEmail = async () => {
    if (!composeSubject || !composeContent) {
      toast({
        title: "Error",
        description: "Please fill in subject and content",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // Create campaign record first
      const { data: campaign, error: campaignError } = await supabase
        .from("email_campaigns")
        .insert({
          subject: composeSubject,
          html_content: composeContent,
          template_id: selectedTemplate?.id,
          status: "sending",
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Send bulk email
      const response = await supabase.functions.invoke("send-bulk-brevo-email", {
        body: {
          subject: composeSubject,
          htmlContent: composeContent,
          campaignId: campaign.id,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Success! 🎉",
        description: `Email sent to ${response.data.sent} subscribers`,
      });

      fetchData();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleSubscription = async (id: string, currentStatus: boolean) => {
    try {
      await supabase
        .from("marketing_subscribers")
        .update({ subscribed: !currentStatus })
        .eq("id", id);
      
      setSubscribers(prev => 
        prev.map(s => s.id === id ? { ...s, subscribed: !currentStatus } : s)
      );
      
      toast({
        title: "Updated",
        description: `Subscription ${!currentStatus ? "enabled" : "disabled"}`,
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ["Email", "Name", "Phone", "Source", "Subscribed", "Date"].join(","),
      ...subscribers.map(s => [
        s.email,
        s.full_name || "",
        s.phone_number || "",
        s.source,
        s.subscribed ? "Yes" : "No",
        format(new Date(s.created_at), "yyyy-MM-dd"),
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone_number?.includes(searchQuery)
  );

  const subscribedCount = subscribers.filter(s => s.subscribed).length;

  return (
    <AdminLayout title="Marketing & Email" description="Manage subscribers and send bulk emails">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing & Email</h1>
          <p className="text-muted-foreground">Manage subscribers and send bulk emails via Brevo</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{subscribers.length}</p>
                  <p className="text-xs text-muted-foreground">Total Subscribers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{subscribedCount}</p>
                  <p className="text-xs text-muted-foreground">Active Subscribers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{templates.length}</p>
                  <p className="text-xs text-muted-foreground">Email Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Send className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{campaigns.length}</p>
                  <p className="text-xs text-muted-foreground">Campaigns Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="compose" className="space-y-4">
          <TabsList>
            <TabsTrigger value="compose">📧 Compose Email</TabsTrigger>
            <TabsTrigger value="subscribers">👥 Subscribers</TabsTrigger>
            <TabsTrigger value="templates">📄 Templates</TabsTrigger>
            <TabsTrigger value="campaigns">📊 Campaigns</TabsTrigger>
          </TabsList>

          {/* Compose Email Tab */}
          <TabsContent value="compose" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Templates List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Email Templates</CardTitle>
                  <CardDescription>Select a template to start</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedTemplate?.id === template.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <p className="font-medium text-sm">{template.name}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {template.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Compose Form */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Compose Email</CardTitle>
                  <CardDescription>
                    Will be sent to {subscribedCount} active subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      placeholder="Enter email subject..."
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>HTML Content</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {showPreview ? "Edit" : "Preview"}
                      </Button>
                    </div>
                    {showPreview ? (
                      <div 
                        className="border rounded-lg p-4 min-h-[300px] bg-white"
                        dangerouslySetInnerHTML={{ __html: composeContent }}
                      />
                    ) : (
                      <Textarea
                        value={composeContent}
                        onChange={(e) => setComposeContent(e.target.value)}
                        placeholder="Enter HTML content..."
                        className="min-h-[300px] font-mono text-sm"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSendBulkEmail}
                      disabled={isSending || !composeSubject || !composeContent}
                      className="flex-1"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send to {subscribedCount} Subscribers
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Subscribers</CardTitle>
                    <CardDescription>All registered users and subscribers</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-48"
                      />
                    </div>
                    <Button variant="outline" onClick={exportSubscribers}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" onClick={fetchData}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscribers.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {sub.full_name || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {sub.phone_number || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{sub.source}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={sub.subscribed ? "default" : "destructive"}>
                              {sub.subscribed ? "Active" : "Unsubscribed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(sub.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleSubscription(sub.id, sub.subscribed)}
                            >
                              {sub.subscribed ? "Unsubscribe" : "Resubscribe"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Pre-made templates for quick campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {templates.map((template) => (
                    <Card key={template.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {template.subject}
                            </p>
                            <Badge variant="secondary" className="mt-2">
                              {template.category}
                            </Badge>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{template.name}</DialogTitle>
                              </DialogHeader>
                              <div 
                                className="border rounded-lg p-4 bg-white"
                                dangerouslySetInnerHTML={{ __html: template.html_content }}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign History</CardTitle>
                <CardDescription>All sent email campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.subject}</TableCell>
                        <TableCell>{campaign.recipients_count}</TableCell>
                        <TableCell>
                          <Badge variant={campaign.status === "sent" ? "default" : "secondary"}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {campaign.sent_at 
                            ? format(new Date(campaign.sent_at), "MMM d, yyyy HH:mm") 
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminMarketing;
