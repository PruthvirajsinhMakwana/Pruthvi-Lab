import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Play, Gamepad2, Download, Share2, GraduationCap, Wrench, Shield,
  Search, ExternalLink, Star, ChevronRight, Sparkles, BookOpen, 
  Globe, Zap, Heart, Info, Bookmark, BookmarkCheck, Music
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedItems } from "@/hooks/useSavedItems";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  resourceCategories, 
  searchResources, 
  getFeaturedResources,
  ResourceCategory,
  Resource 
} from "@/data/fmhyResources";

const iconMap: Record<string, React.ElementType> = {
  Play,
  Gamepad2,
  Download,
  Share2,
  GraduationCap,
  Wrench,
  Shield,
  Sparkles,
  Music,
  BookOpen,
};

function ResourceCard({ 
  resource, 
  showCategory = false,
  isSaved,
  onToggleSave,
  isAuthenticated
}: { 
  resource: Resource; 
  showCategory?: boolean;
  isSaved: boolean;
  onToggleSave: (resourceId: string) => void;
  isAuthenticated: boolean;
}) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave(resource.id);
  };

  return (
    <div className="group relative">
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Card className="h-full glass border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors flex items-center gap-2 pr-8">
                {resource.name}
                {resource.isFeatured && (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                )}
              </CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <CardDescription className="text-sm line-clamp-2">
              {resource.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.mirrors && resource.mirrors.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs cursor-help">
                      +{resource.mirrors.length} mirrors
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Alternative URLs available</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </CardContent>
        </Card>
      </a>
      
      {/* Bookmark Button */}
      <button
        onClick={handleBookmarkClick}
        className={`absolute top-3 right-3 p-1.5 rounded-full transition-all duration-200 z-10 ${
          isSaved 
            ? "bg-primary text-primary-foreground" 
            : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-primary hover:bg-background"
        }`}
        title={isSaved ? "Remove from saved" : "Save resource"}
      >
        {isSaved ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | "all">("all");
  const { user } = useAuth();
  const { savedItems, saveItem, unsaveItem, isItemSaved } = useSavedItems("resource");
  
  const featuredResources = useMemo(() => getFeaturedResources().slice(0, 8), []);
  
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchResources(searchQuery);
  }, [searchQuery]);
  
  const currentCategory = useMemo(() => {
    if (selectedCategory === "all") return null;
    return resourceCategories.find(c => c.id === selectedCategory);
  }, [selectedCategory]);

  const totalResources = useMemo(() => {
    return resourceCategories.reduce((total, cat) => {
      return total + cat.subcategories.reduce((subTotal, sub) => subTotal + sub.resources.length, 0);
    }, 0);
  }, []);

  const handleToggleSave = async (resourceId: string) => {
    if (!user) {
      toast.error("Please sign in to save resources");
      return;
    }
    
    if (isItemSaved(resourceId, "resource")) {
      await unsaveItem(resourceId, "resource");
    } else {
      await saveItem(resourceId, "resource");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Free Resources Hub</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6">
                <span className="text-gradient">The Ultimate Collection</span>
                <br />
                <span className="text-foreground">of Free Resources</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Curated links to streaming sites, games, software, courses, and more. 
                Over <span className="text-primary font-semibold">{totalResources}+</span> resources organized by category.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search all resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                />
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {resourceCategories.slice(0, 4).map((cat) => {
                  const Icon = iconMap[cat.icon];
                  const resourceCount = cat.subcategories.reduce((t, s) => t + s.resources.length, 0);
                  return (
                    <div key={cat.id} className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{resourceCount} {cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-muted-foreground">
                Found {searchResults.length} resources
              </p>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchResults.slice(0, 20).map((resource) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    showCategory 
                    isSaved={isItemSaved(resource.id, "resource")}
                    onToggleSave={handleToggleSave}
                    isAuthenticated={!!user}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass border-border/50 p-8 text-center">
                <p className="text-muted-foreground">No resources found matching your search.</p>
              </Card>
            )}
          </div>
        )}

        {/* Main Content */}
        {!searchQuery.trim() && (
          <div className="container mx-auto px-4 py-8">
            {/* Featured Resources */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    Featured Resources
                  </h2>
                  <p className="text-muted-foreground">Top picks from our collection</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredResources.map((resource) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    isSaved={isItemSaved(resource.id, "resource")}
                    onToggleSave={handleToggleSave}
                    isAuthenticated={!!user}
                  />
                ))}
              </div>
            </section>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ResourceCategory | "all")}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
                <ScrollArea className="w-full whitespace-nowrap">
                  <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-lg">
                    <TabsTrigger 
                      value="all" 
                      className="rounded-md px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      All Categories
                    </TabsTrigger>
                    {resourceCategories.map((category) => {
                      const Icon = iconMap[category.icon];
                      return (
                        <TabsTrigger
                          key={category.id}
                          value={category.id}
                          className="rounded-md px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {category.name}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </ScrollArea>
              </div>

              {/* All Categories View */}
              <TabsContent value="all" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resourceCategories.map((category, index) => {
                    const Icon = iconMap[category.icon];
                    const resourceCount = category.subcategories.reduce((t, s) => t + s.resources.length, 0);
                    return (
                      <Card 
                        key={category.id}
                        className="glass border-border/50 card-hover cursor-pointer overflow-hidden group animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {category.name}
                              </CardTitle>
                              <CardDescription>
                                {resourceCount} resources
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {category.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {category.subcategories.slice(0, 3).map((sub) => (
                              <Badge key={sub.name} variant="secondary" className="text-xs">
                                {sub.name}
                              </Badge>
                            ))}
                            {category.subcategories.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{category.subcategories.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Individual Category Views */}
              {resourceCategories.map((category) => {
                const Icon = iconMap[category.icon];
                return (
                  <TabsContent key={category.id} value={category.id} className="mt-0">
                    <Card className="glass border-border/50 mb-6">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                            <Icon className="h-8 w-8" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">{category.name}</CardTitle>
                            <CardDescription className="text-base">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    <Accordion type="multiple" defaultValue={category.subcategories.map(s => s.name)} className="space-y-4">
                      {category.subcategories.map((subcategory) => (
                        <AccordionItem 
                          key={subcategory.name} 
                          value={subcategory.name}
                          className="border rounded-lg bg-card/50 backdrop-blur-sm px-4"
                        >
                          <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-lg">{subcategory.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {subcategory.resources.length}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                              {subcategory.resources.map((resource) => (
                                <ResourceCard 
                                  key={resource.id} 
                                  resource={resource} 
                                  isSaved={isItemSaved(resource.id, "resource")}
                                  onToggleSave={handleToggleSave}
                                  isAuthenticated={!!user}
                                />
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                );
              })}
            </Tabs>

            {/* Info Banner */}
            <Card className="mt-12 glass border-border/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">About This Resource Hub</h3>
                  <p className="text-sm text-muted-foreground">
                    This collection is curated from FMHY (FreeMediaHeckYeah) - the largest collection of free stuff on the internet. 
                    Always use an adblocker and VPN when accessing these resources. We recommend uBlock Origin and Mullvad VPN.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="https://fmhy.net/" target="_blank" rel="noopener noreferrer">
                    Visit FMHY
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
