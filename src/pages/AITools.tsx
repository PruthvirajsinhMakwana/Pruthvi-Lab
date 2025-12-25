import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Image, 
  Video, 
  MessageSquare, 
  Code2, 
  Music, 
  FileText, 
  Sparkles,
  ExternalLink,
  Filter,
  Star,
  Zap,
  DollarSign,
  Gift
} from "lucide-react";

type AITool = {
  name: string;
  description: string;
  category: string;
  pricing: "free" | "freemium" | "paid" | "trial";
  trialCredits?: string;
  url: string;
  features: string[];
  rating?: number;
};

const categories = [
  { id: "all", name: "All Tools", icon: Sparkles },
  { id: "image", name: "Image Generation", icon: Image },
  { id: "video", name: "Video Creation", icon: Video },
  { id: "chat", name: "Chat & Assistant", icon: MessageSquare },
  { id: "code", name: "Code & Dev", icon: Code2 },
  { id: "audio", name: "Audio & Music", icon: Music },
  { id: "writing", name: "Writing & Content", icon: FileText },
];

const pricingFilters = [
  { id: "all", name: "All", icon: Filter },
  { id: "free", name: "Free", icon: Gift },
  { id: "freemium", name: "Freemium", icon: Zap },
  { id: "trial", name: "Free Trial", icon: Star },
  { id: "paid", name: "Paid", icon: DollarSign },
];

const aiTools: AITool[] = [
  // Image Generation
  { name: "Midjourney", description: "Premium AI art generator with stunning artistic styles", category: "image", pricing: "paid", url: "https://midjourney.com", features: ["Artistic styles", "High quality", "Discord based"], rating: 4.9 },
  { name: "DALL-E 3", description: "OpenAI's latest image generator with excellent prompt understanding", category: "image", pricing: "freemium", trialCredits: "15 free credits/month", url: "https://openai.com/dall-e-3", features: ["Text in images", "Precise prompts", "ChatGPT integration"], rating: 4.8 },
  { name: "Stable Diffusion", description: "Open-source image generation you can run locally", category: "image", pricing: "free", url: "https://stability.ai", features: ["Open source", "Local running", "Customizable"], rating: 4.7 },
  { name: "Leonardo.AI", description: "AI image generation with fine-tuned models for games & design", category: "image", pricing: "freemium", trialCredits: "150 tokens/day free", url: "https://leonardo.ai", features: ["Game assets", "Fine-tuning", "Canvas editor"], rating: 4.6 },
  { name: "Ideogram", description: "AI that excels at generating text within images", category: "image", pricing: "freemium", trialCredits: "25 free/day", url: "https://ideogram.ai", features: ["Text generation", "Logos", "Typography"], rating: 4.5 },
  { name: "Playground AI", description: "Free AI image generator with mixed styles", category: "image", pricing: "freemium", trialCredits: "500 free/day", url: "https://playground.ai", features: ["Mixed styles", "Editing tools", "Community"], rating: 4.4 },
  { name: "Adobe Firefly", description: "Adobe's AI image generator integrated with Creative Cloud", category: "image", pricing: "freemium", trialCredits: "25 credits/month free", url: "https://firefly.adobe.com", features: ["Adobe integration", "Commercial safe", "Style transfer"], rating: 4.6 },
  { name: "Canva AI", description: "AI image generation built into Canva's design platform", category: "image", pricing: "freemium", trialCredits: "50 uses/month free", url: "https://canva.com", features: ["Design integration", "Easy to use", "Templates"], rating: 4.5 },
  { name: "Bing Image Creator", description: "Microsoft's free DALL-E powered image generator", category: "image", pricing: "free", url: "https://bing.com/create", features: ["DALL-E 3", "Free unlimited", "Microsoft account"], rating: 4.4 },
  { name: "Craiyon", description: "Formerly DALL-E Mini, completely free AI art", category: "image", pricing: "free", url: "https://craiyon.com", features: ["Completely free", "No signup", "Fast"], rating: 4.0 },
  { name: "NightCafe", description: "AI art generator with multiple algorithms and styles", category: "image", pricing: "freemium", trialCredits: "5 free credits/day", url: "https://nightcafe.studio", features: ["Multiple algorithms", "Art styles", "Community"], rating: 4.3 },
  { name: "Lexica", description: "Stable Diffusion search engine and generator", category: "image", pricing: "freemium", trialCredits: "100 free/month", url: "https://lexica.art", features: ["Prompt search", "Aperture model", "Gallery"], rating: 4.4 },
  
  // Video Creation
  { name: "Runway", description: "Professional AI video generation and editing suite", category: "video", pricing: "freemium", trialCredits: "125 credits free", url: "https://runway.ml", features: ["Gen-2 video", "Green screen", "Motion brush"], rating: 4.8 },
  { name: "Pika Labs", description: "AI video generation from text and images", category: "video", pricing: "freemium", trialCredits: "250 credits free", url: "https://pika.art", features: ["Text to video", "Image animation", "Style control"], rating: 4.7 },
  { name: "Synthesia", description: "AI video creation with realistic avatars", category: "video", pricing: "paid", url: "https://synthesia.io", features: ["AI avatars", "Multiple languages", "Enterprise"], rating: 4.6 },
  { name: "HeyGen", description: "AI spokesperson videos with custom avatars", category: "video", pricing: "freemium", trialCredits: "1 free video", url: "https://heygen.com", features: ["Custom avatars", "Voice cloning", "Templates"], rating: 4.5 },
  { name: "D-ID", description: "Create talking avatar videos from photos", category: "video", pricing: "freemium", trialCredits: "5 min free", url: "https://d-id.com", features: ["Photo animation", "Voice sync", "API"], rating: 4.4 },
  { name: "Luma AI", description: "Dream Machine for high-quality AI video generation", category: "video", pricing: "freemium", trialCredits: "30 generations/month", url: "https://lumalabs.ai", features: ["Realistic motion", "Fast generation", "High quality"], rating: 4.7 },
  { name: "Kaiber", description: "AI video generation with artistic transformations", category: "video", pricing: "freemium", trialCredits: "60 credits free", url: "https://kaiber.ai", features: ["Music videos", "Art styles", "Transforms"], rating: 4.3 },
  { name: "Invideo AI", description: "Create videos from text prompts automatically", category: "video", pricing: "freemium", trialCredits: "10 min/week free", url: "https://invideo.io", features: ["Text to video", "Templates", "Stock media"], rating: 4.4 },
  { name: "Pictory", description: "Turn scripts and articles into videos", category: "video", pricing: "trial", trialCredits: "3 free videos", url: "https://pictory.ai", features: ["Script to video", "Auto captions", "Editing"], rating: 4.3 },
  { name: "Fliki", description: "Text to video with AI voices", category: "video", pricing: "freemium", trialCredits: "5 min/month free", url: "https://fliki.ai", features: ["AI voices", "Stock media", "Easy editing"], rating: 4.4 },

  // Chat & Assistant
  { name: "ChatGPT", description: "OpenAI's conversational AI, the most popular chatbot", category: "chat", pricing: "freemium", trialCredits: "GPT-3.5 free unlimited", url: "https://chat.openai.com", features: ["GPT-4", "Plugins", "Code interpreter"], rating: 4.9 },
  { name: "Claude", description: "Anthropic's helpful, harmless AI assistant", category: "chat", pricing: "freemium", trialCredits: "Free tier available", url: "https://claude.ai", features: ["Long context", "Safe", "Analytical"], rating: 4.8 },
  { name: "Google Gemini", description: "Google's multimodal AI assistant", category: "chat", pricing: "freemium", trialCredits: "Free tier available", url: "https://gemini.google.com", features: ["Multimodal", "Google integration", "Real-time"], rating: 4.7 },
  { name: "Perplexity", description: "AI search engine with cited sources", category: "chat", pricing: "freemium", trialCredits: "Free searches unlimited", url: "https://perplexity.ai", features: ["Web search", "Citations", "Copilot"], rating: 4.8 },
  { name: "Microsoft Copilot", description: "AI assistant integrated with Microsoft products", category: "chat", pricing: "freemium", trialCredits: "Free with limits", url: "https://copilot.microsoft.com", features: ["GPT-4", "Bing search", "Office integration"], rating: 4.6 },
  { name: "Pi", description: "Personal AI by Inflection, focused on conversations", category: "chat", pricing: "free", url: "https://pi.ai", features: ["Conversational", "Emotional", "Voice"], rating: 4.4 },
  { name: "Character.AI", description: "Chat with AI characters and personalities", category: "chat", pricing: "freemium", trialCredits: "Free unlimited", url: "https://character.ai", features: ["Characters", "Roleplay", "Custom bots"], rating: 4.5 },
  { name: "Poe", description: "Access multiple AI models in one platform", category: "chat", pricing: "freemium", trialCredits: "Limited free daily", url: "https://poe.com", features: ["Multiple models", "Custom bots", "API"], rating: 4.5 },
  { name: "You.com", description: "AI search and chat with privacy focus", category: "chat", pricing: "freemium", trialCredits: "Free tier available", url: "https://you.com", features: ["Private", "Search", "Multiple modes"], rating: 4.3 },
  { name: "Jasper Chat", description: "AI chat for marketing and business", category: "chat", pricing: "trial", trialCredits: "7-day free trial", url: "https://jasper.ai", features: ["Marketing focus", "Brand voice", "Templates"], rating: 4.4 },

  // Code & Dev
  { name: "GitHub Copilot", description: "AI pair programmer that suggests code in real-time", category: "code", pricing: "paid", url: "https://github.com/features/copilot", features: ["IDE integration", "Multiple languages", "Context aware"], rating: 4.8 },
  { name: "Cursor", description: "AI-first code editor built for pair programming", category: "code", pricing: "freemium", trialCredits: "2000 completions free", url: "https://cursor.sh", features: ["Full IDE", "Chat", "Codebase aware"], rating: 4.7 },
  { name: "Replit AI", description: "AI coding assistant in Replit's cloud IDE", category: "code", pricing: "freemium", trialCredits: "Basic AI free", url: "https://replit.com", features: ["Cloud IDE", "Deployment", "Collaboration"], rating: 4.5 },
  { name: "Tabnine", description: "AI code completion for any IDE", category: "code", pricing: "freemium", trialCredits: "Basic free forever", url: "https://tabnine.com", features: ["Private", "Team learning", "Any IDE"], rating: 4.4 },
  { name: "Codeium", description: "Free AI code completion and chat", category: "code", pricing: "free", url: "https://codeium.com", features: ["Free forever", "40+ languages", "Fast"], rating: 4.5 },
  { name: "Amazon CodeWhisperer", description: "AWS's AI coding companion", category: "code", pricing: "freemium", trialCredits: "Free for individuals", url: "https://aws.amazon.com/codewhisperer", features: ["AWS integration", "Security scans", "Free tier"], rating: 4.3 },
  { name: "Sourcegraph Cody", description: "AI coding assistant with codebase context", category: "code", pricing: "freemium", trialCredits: "Free for individuals", url: "https://sourcegraph.com/cody", features: ["Codebase search", "Context aware", "Explanations"], rating: 4.4 },
  { name: "Phind", description: "AI search engine for developers", category: "code", pricing: "freemium", trialCredits: "Free unlimited", url: "https://phind.com", features: ["Dev focused", "Code examples", "Fast"], rating: 4.5 },
  { name: "Blackbox AI", description: "AI code generation and search", category: "code", pricing: "freemium", trialCredits: "Free tier available", url: "https://blackbox.ai", features: ["Code search", "Generation", "Browser extension"], rating: 4.2 },
  { name: "AskCodi", description: "AI coding assistant for multiple languages", category: "code", pricing: "freemium", trialCredits: "50 credits/month free", url: "https://askcodi.com", features: ["Code generation", "Explanations", "Tests"], rating: 4.1 },

  // Audio & Music
  { name: "ElevenLabs", description: "Most realistic AI voice generation and cloning", category: "audio", pricing: "freemium", trialCredits: "10k characters/month free", url: "https://elevenlabs.io", features: ["Voice cloning", "Realistic", "Multiple languages"], rating: 4.9 },
  { name: "Murf AI", description: "AI voice generator for videos and presentations", category: "audio", pricing: "freemium", trialCredits: "10 min free", url: "https://murf.ai", features: ["120+ voices", "Studio quality", "Video sync"], rating: 4.5 },
  { name: "Suno", description: "AI music generation from text prompts", category: "audio", pricing: "freemium", trialCredits: "50 credits/day free", url: "https://suno.ai", features: ["Full songs", "Lyrics", "Multiple genres"], rating: 4.8 },
  { name: "Udio", description: "Create music with AI, high quality generation", category: "audio", pricing: "freemium", trialCredits: "1200 credits/month free", url: "https://udio.com", features: ["High quality", "Extend songs", "Remix"], rating: 4.7 },
  { name: "AIVA", description: "AI composer for emotional soundtracks", category: "audio", pricing: "freemium", trialCredits: "3 downloads/month free", url: "https://aiva.ai", features: ["Orchestral", "Soundtracks", "Customizable"], rating: 4.4 },
  { name: "Soundraw", description: "AI music generator for creators", category: "audio", pricing: "freemium", trialCredits: "Free preview", url: "https://soundraw.io", features: ["Royalty free", "Customizable", "Moods"], rating: 4.3 },
  { name: "Voicemod", description: "Real-time AI voice changer", category: "audio", pricing: "freemium", trialCredits: "Basic free", url: "https://voicemod.net", features: ["Real-time", "Voice effects", "Streaming"], rating: 4.2 },
  { name: "Descript", description: "AI audio/video editing with transcription", category: "audio", pricing: "freemium", trialCredits: "1 hour/month free", url: "https://descript.com", features: ["Overdub", "Transcription", "Editing"], rating: 4.6 },
  { name: "Resemble AI", description: "AI voice cloning and generation platform", category: "audio", pricing: "trial", trialCredits: "10 sec free clone", url: "https://resemble.ai", features: ["Voice cloning", "API", "Real-time"], rating: 4.4 },
  { name: "Speechify", description: "Text to speech with natural AI voices", category: "audio", pricing: "freemium", trialCredits: "Limited free", url: "https://speechify.com", features: ["Natural voices", "Browser extension", "Mobile"], rating: 4.3 },

  // Writing & Content
  { name: "Jasper", description: "AI writing assistant for marketing teams", category: "writing", pricing: "paid", url: "https://jasper.ai", features: ["Brand voice", "Templates", "SEO"], rating: 4.6 },
  { name: "Copy.ai", description: "AI copywriting for marketing content", category: "writing", pricing: "freemium", trialCredits: "2000 words/month free", url: "https://copy.ai", features: ["Marketing copy", "Workflows", "Brand voice"], rating: 4.5 },
  { name: "Writesonic", description: "AI writing tool for articles and ads", category: "writing", pricing: "freemium", trialCredits: "10k words free", url: "https://writesonic.com", features: ["SEO articles", "Ads", "Product descriptions"], rating: 4.4 },
  { name: "Rytr", description: "Affordable AI writing assistant", category: "writing", pricing: "freemium", trialCredits: "10k characters/month free", url: "https://rytr.me", features: ["40+ templates", "Affordable", "SEO"], rating: 4.3 },
  { name: "Notion AI", description: "AI writing integrated into Notion workspace", category: "writing", pricing: "paid", url: "https://notion.so/product/ai", features: ["Notion integration", "Summarize", "Translate"], rating: 4.5 },
  { name: "Grammarly", description: "AI writing assistant for grammar and style", category: "writing", pricing: "freemium", trialCredits: "Basic free forever", url: "https://grammarly.com", features: ["Grammar", "Tone", "Plagiarism"], rating: 4.7 },
  { name: "QuillBot", description: "AI paraphrasing and writing tool", category: "writing", pricing: "freemium", trialCredits: "125 words free", url: "https://quillbot.com", features: ["Paraphrase", "Summarize", "Grammar"], rating: 4.4 },
  { name: "Wordtune", description: "AI writing companion for rewriting", category: "writing", pricing: "freemium", trialCredits: "10 rewrites/day free", url: "https://wordtune.com", features: ["Rewrite", "Expand", "Shorten"], rating: 4.3 },
  { name: "Sudowrite", description: "AI writing tool for fiction authors", category: "writing", pricing: "trial", trialCredits: "4000 words free trial", url: "https://sudowrite.com", features: ["Fiction focus", "Story engine", "Describe"], rating: 4.5 },
  { name: "Anyword", description: "AI copywriting with performance prediction", category: "writing", pricing: "trial", trialCredits: "7-day free trial", url: "https://anyword.com", features: ["Predictive scores", "A/B testing", "Brand voice"], rating: 4.3 },
];

const AITools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");

  const filteredTools = useMemo(() => {
    return aiTools.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
      const matchesPricing = selectedPricing === "all" || tool.pricing === selectedPricing;
      
      return matchesSearch && matchesCategory && matchesPricing;
    });
  }, [searchQuery, selectedCategory, selectedPricing]);

  const getPricingBadge = (pricing: string, trialCredits?: string) => {
    switch (pricing) {
      case "free":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">🎁 Free</Badge>;
      case "freemium":
        return (
          <div className="flex flex-col gap-1">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">⚡ Freemium</Badge>
            {trialCredits && <span className="text-xs text-muted-foreground">{trialCredits}</span>}
          </div>
        );
      case "trial":
        return (
          <div className="flex flex-col gap-1">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">⭐ Free Trial</Badge>
            {trialCredits && <span className="text-xs text-muted-foreground">{trialCredits}</span>}
          </div>
        );
      case "paid":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">💎 Paid</Badge>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Sparkles;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            AI Tools Directory
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Best AI Tools Collection
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover {aiTools.length}+ AI tools for image generation, video creation, coding, writing, and more. 
            Find the perfect AI for your needs with our curated collection.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search AI tools by name, description, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Categories</h3>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="shrink-0"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Pricing Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Pricing</h3>
          <div className="flex flex-wrap gap-2">
            {pricingFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <Button
                  key={filter.id}
                  variant={selectedPricing === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPricing(filter.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {filter.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredTools.length}</span> AI tools
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool, index) => {
            const CategoryIcon = getCategoryIcon(tool.category);
            return (
              <Card key={index} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        {tool.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">{tool.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {getPricingBadge(tool.pricing, tool.trialCredits)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tool.features.slice(0, 3).map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => window.open(tool.url, "_blank")}
                  >
                    Visit Website
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="p-4 rounded-full bg-muted inline-block mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-1">{aiTools.length}+</div>
            <div className="text-sm text-muted-foreground">AI Tools</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-green-500 mb-1">
              {aiTools.filter(t => t.pricing === "free").length}
            </div>
            <div className="text-sm text-muted-foreground">Free Tools</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {aiTools.filter(t => t.pricing === "freemium").length}
            </div>
            <div className="text-sm text-muted-foreground">Freemium Options</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-yellow-500 mb-1">
              {categories.length - 1}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AITools;
