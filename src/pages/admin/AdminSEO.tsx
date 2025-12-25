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
  Image,
  Palette,
  Smartphone
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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="favicon" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Favicon</span>
            </TabsTrigger>
            <TabsTrigger value="pwa" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">PWA</span>
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

          {/* Favicon Tab */}
          <TabsContent value="favicon" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Favicon Settings
                </CardTitle>
                <CardDescription>
                  Configure your site's favicon that appears in browser tabs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="favicon_url">Favicon URL</Label>
                  <Input
                    id="favicon_url"
                    value={formData.favicon_url}
                    onChange={(e) => handleInputChange("favicon_url", e.target.value)}
                    placeholder="/favicon.ico or https://example.com/favicon.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 32x32 or 180x180 pixels for best compatibility
                  </p>
                </div>

                {/* Favicon Preview */}
                {formData.favicon_url && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-2 px-3 py-2 bg-background rounded border">
                        <img 
                          src={formData.favicon_url} 
                          alt="Favicon preview" 
                          className="w-4 h-4 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <span className="text-sm">{formData.site_title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Browser tab preview</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PWA Tab */}
          <TabsContent value="pwa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  PWA Manifest Settings
                </CardTitle>
                <CardDescription>
                  Configure how your site appears when installed as a Progressive Web App
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pwa_name">App Name</Label>
                  <Input
                    id="pwa_name"
                    value={formData.pwa_name}
                    onChange={(e) => handleInputChange("pwa_name", e.target.value)}
                    placeholder="My Awesome App"
                  />
                  <p className="text-xs text-muted-foreground">
                    Full name shown when installing the app
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pwa_short_name">Short Name</Label>
                  <Input
                    id="pwa_short_name"
                    value={formData.pwa_short_name}
                    onChange={(e) => handleInputChange("pwa_short_name", e.target.value)}
                    placeholder="MyApp"
                    maxLength={12}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.pwa_short_name.length}/12 characters - shown on home screen
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pwa_description">App Description</Label>
                  <Textarea
                    id="pwa_description"
                    value={formData.pwa_description}
                    onChange={(e) => handleInputChange("pwa_description", e.target.value)}
                    placeholder="A brief description of your app"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pwa_theme_color" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Theme Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="pwa_theme_color"
                        value={formData.pwa_theme_color}
                        onChange={(e) => handleInputChange("pwa_theme_color", e.target.value)}
                        placeholder="#8B5CF6"
                        className="flex-1"
                      />
                      <input
                        type="color"
                        value={formData.pwa_theme_color}
                        onChange={(e) => handleInputChange("pwa_theme_color", e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Browser toolbar color on mobile
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pwa_background_color" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Background Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="pwa_background_color"
                        value={formData.pwa_background_color}
                        onChange={(e) => handleInputChange("pwa_background_color", e.target.value)}
                        placeholder="#0F0A1F"
                        className="flex-1"
                      />
                      <input
                        type="color"
                        value={formData.pwa_background_color}
                        onChange={(e) => handleInputChange("pwa_background_color", e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Splash screen background color
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PWA Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Install Preview</CardTitle>
                <CardDescription>
                  How your app might appear when installed on a device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="w-48 mx-auto p-6 rounded-2xl border-2 flex flex-col items-center gap-3"
                  style={{ backgroundColor: formData.pwa_background_color }}
                >
                  {formData.favicon_url ? (
                    <img 
                      src={formData.favicon_url} 
                      alt="App icon" 
                      className="w-16 h-16 rounded-2xl object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: formData.pwa_theme_color }}
                    >
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <span 
                    className="text-sm font-medium text-center"
                    style={{ color: formData.pwa_theme_color }}
                  >
                    {formData.pwa_short_name || formData.pwa_name || "App Name"}
                  </span>
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
