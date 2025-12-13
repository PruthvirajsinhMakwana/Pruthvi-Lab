import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookOpen, Code, Zap, FileText, Trash2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSavedItems, ItemType } from "@/hooks/useSavedItems";
import { Skeleton } from "@/components/ui/skeleton";

const tabConfig = [
  { value: "all", label: "All", icon: Bookmark },
  { value: "blog", label: "Blogs", icon: FileText },
  { value: "tutorial", label: "Tutorials", icon: BookOpen },
  { value: "code_snippet", label: "Code", icon: Code },
  { value: "api", label: "APIs", icon: Zap },
];

const getItemIcon = (type: ItemType) => {
  switch (type) {
    case "blog":
      return <FileText className="h-4 w-4" />;
    case "tutorial":
      return <BookOpen className="h-4 w-4" />;
    case "code_snippet":
      return <Code className="h-4 w-4" />;
    case "api":
      return <Zap className="h-4 w-4" />;
    default:
      return <Bookmark className="h-4 w-4" />;
  }
};

const getItemTypeLabel = (type: ItemType) => {
  switch (type) {
    case "code_snippet":
      return "Code Snippet";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export default function Library() {
  const [activeTab, setActiveTab] = useState("all");
  const { savedItems, loading, unsaveItem } = useSavedItems(
    activeTab === "all" ? undefined : (activeTab as ItemType)
  );

  const handleRemove = async (itemId: string, itemType: ItemType) => {
    await unsaveItem(itemId, itemType);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-primary" />
            My Library
          </h1>
          <p className="text-muted-foreground mt-2">
            Your saved blogs, tutorials, code snippets, and APIs
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {tabConfig.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabConfig.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : savedItems.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Bookmark className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium text-foreground mb-2">
                      No saved items yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                      {tab.value === "all"
                        ? "Browse our content and save items to access them here."
                        : `You haven't saved any ${tab.label.toLowerCase()} yet.`}
                    </p>
                    <Button variant="outline" asChild>
                      <Link to={tab.value === "all" ? "/tutorials" : `/${tab.value === "code_snippet" ? "code-library" : tab.value + "s"}`}>
                        Browse {tab.label}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedItems.map((item) => (
                    <Card key={item.id} className="group hover:shadow-medium transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary" className="gap-1">
                            {getItemIcon(item.item_type)}
                            {getItemTypeLabel(item.item_type)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                            onClick={() => handleRemove(item.item_id, item.item_type)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-base mb-1">
                          {/* Placeholder - will be replaced with actual content when content tables exist */}
                          Saved Item
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Saved on {new Date(item.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
}
