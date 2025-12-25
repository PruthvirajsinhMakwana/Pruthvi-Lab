import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings, SEOSettings } from "@/hooks/useSiteSettings";
import { 
  Globe, 
  Search, 
  Share2, 
  BarChart3, 
  FileText, 
  Save, 
  Loader2, 
  X, 
  Plus,
  Twitter,
  Image
} from "lucide-react";

export default function AdminSEO() {
  const { seoSettings, loading, saving, updateSEOSettings } = useSiteSettings();
  const [formData, setFormData] = useState<SEOSettings>(seoSettings);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    setFormData(seoSettings);
  }, [seoSettings]);

  const handleInputChange = (field: keyof SEOSettings, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.site_keywords.includes(newKeyword.trim())) {
      handleInputChange("site_keywords", [...formData.site_keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    handleInputChange(
      "site_keywords",
      formData.site_keywords.filter((k) => k !== keyword)
    );
  };

  const handleSave = () => {
    updateSEOSettings(formData);
  };

  if (loading) {
    return (
      <AdminLayout title="Site SEO Settings" description="Manage your site's search engine optimization">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site SEO Settings" description="Manage your site's search engine optimization and meta tags">
      <div className="space-y-6">
        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-gradient-primary"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* General SEO Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Basic SEO Settings
                </CardTitle>
                <CardDescription>
                  Configure your site's title, description, and keywords for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Site Title */}
                <div className="space-y-2">
                  <Label htmlFor="site_title">Site Title</Label>
                  <Input
                    id="site_title"
                    value={formData.site_title}
                    onChange={(e) => handleInputChange("site_title", e.target.value)}
                    placeholder="Enter your site title"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.site_title.length}/60 characters (recommended max)
                  </p>
                </div>

                {/* Site Description */}
                <div className="space-y-2">
                  <Label htmlFor="site_description">Meta Description</Label>
                  <Textarea
                    id="site_description"
                    value={formData.site_description}
                    onChange={(e) => handleInputChange("site_description", e.target.value)}
                    placeholder="Enter a compelling description for search engines"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.site_description.length}/160 characters (recommended max)
                  </p>
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add a keyword"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                    />
                    <Button type="button" onClick={addKeyword} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.site_keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="pl-3 pr-1 py-1">
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Search Preview</CardTitle>
                <CardDescription>
                  How your site might appear in Google search results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <div className="text-primary text-lg hover:underline cursor-pointer">
                    {formData.site_title || "Your Site Title"}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    https://pruthvislab.com
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {formData.site_description || "Your site description will appear here..."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Social Media Settings
                </CardTitle>
                <CardDescription>
                  Configure how your site appears when shared on social media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* OG Image */}
                <div className="space-y-2">
                  <Label htmlFor="og_image" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Open Graph Image URL
                  </Label>
                  <Input
                    id="og_image"
                    value={formData.og_image}
                    onChange={(e) => handleInputChange("og_image", e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 1200x630 pixels
                  </p>
                </div>

                {/* Twitter Handle */}
                <div className="space-y-2">
                  <Label htmlFor="twitter_handle" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter Handle
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      @
                    </span>
                    <Input
                      id="twitter_handle"
                      value={formData.twitter_handle}
                      onChange={(e) => handleInputChange("twitter_handle", e.target.value)}
                      placeholder="yourhandle"
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Preview</CardTitle>
                <CardDescription>
                  How your site might appear when shared on social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md border rounded-lg overflow-hidden bg-card">
                  {formData.og_image ? (
                    <img
                      src={formData.og_image}
                      alt="OG Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <Image className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground uppercase">pruthvislab.com</div>
                    <div className="font-semibold mt-1">
                      {formData.site_title || "Your Site Title"}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {formData.site_description || "Your site description..."}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Analytics Integration
                </CardTitle>
                <CardDescription>
                  Connect your analytics tools to track site performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Google Analytics */}
                <div className="space-y-2">
                  <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                  <Input
                    id="google_analytics_id"
                    value={formData.google_analytics_id}
                    onChange={(e) => handleInputChange("google_analytics_id", e.target.value)}
                    placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your Google Analytics 4 (G-) or Universal Analytics (UA-) ID
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>
                  Configure robots.txt and other advanced SEO settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Robots.txt */}
                <div className="space-y-2">
                  <Label htmlFor="robots_txt">Robots.txt Content</Label>
                  <Textarea
                    id="robots_txt"
                    value={formData.robots_txt}
                    onChange={(e) => handleInputChange("robots_txt", e.target.value)}
                    placeholder="User-agent: *&#10;Allow: /"
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls how search engines crawl and index your site
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
