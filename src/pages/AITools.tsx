import { useState, useMemo, useEffect } from "react";
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
  Star,
  Zap,
  DollarSign,
  Gift,
  Presentation,
  GraduationCap,
  Briefcase,
  Palette,
  Bot,
  Database,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  Heart,
  GitCompare,
  Check,
  ChevronDown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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
  { id: "all", name: "All Tools", icon: Sparkles, color: "bg-primary/10 text-primary" },
  { id: "image", name: "Image", icon: Image, color: "bg-pink-500/10 text-pink-500" },
  { id: "video", name: "Video", icon: Video, color: "bg-red-500/10 text-red-500" },
  { id: "chat", name: "Chat", icon: MessageSquare, color: "bg-blue-500/10 text-blue-500" },
  { id: "code", name: "Code", icon: Code2, color: "bg-green-500/10 text-green-500" },
  { id: "audio", name: "Audio", icon: Music, color: "bg-orange-500/10 text-orange-500" },
  { id: "writing", name: "Writing", icon: FileText, color: "bg-purple-500/10 text-purple-500" },
  { id: "design", name: "Design", icon: Palette, color: "bg-cyan-500/10 text-cyan-500" },
  { id: "productivity", name: "Productivity", icon: Briefcase, color: "bg-amber-500/10 text-amber-500" },
  { id: "education", name: "Education", icon: GraduationCap, color: "bg-indigo-500/10 text-indigo-500" },
  { id: "presentation", name: "Slides", icon: Presentation, color: "bg-teal-500/10 text-teal-500" },
  { id: "data", name: "Research", icon: Database, color: "bg-slate-500/10 text-slate-500" },
  { id: "avatar", name: "3D & Avatar", icon: Bot, color: "bg-violet-500/10 text-violet-500" },
];

const pricingFilters = [
  { id: "all", name: "All Pricing", icon: SlidersHorizontal },
  { id: "free", name: "Free", icon: Gift },
  { id: "freemium", name: "Freemium", icon: Zap },
  { id: "trial", name: "Free Trial", icon: Star },
  { id: "paid", name: "Paid", icon: DollarSign },
];

const aiTools: AITool[] = [
  // Image Generation (20+ tools)
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
  { name: "DreamStudio", description: "Official Stable Diffusion web interface by Stability AI", category: "image", pricing: "freemium", trialCredits: "25 free credits", url: "https://dreamstudio.ai", features: ["Official SD", "Multiple models", "Inpainting"], rating: 4.5 },
  { name: "Artbreeder", description: "Collaborative AI art creation with gene mixing", category: "image", pricing: "freemium", trialCredits: "5 free/month", url: "https://artbreeder.com", features: ["Gene mixing", "Portraits", "Landscapes"], rating: 4.3 },
  { name: "Wombo Dream", description: "Mobile-friendly AI art generator", category: "image", pricing: "freemium", trialCredits: "Limited free", url: "https://dream.ai", features: ["Mobile app", "NFT minting", "Quick generation"], rating: 4.2 },
  { name: "Jasper Art", description: "AI image generation for marketing content", category: "image", pricing: "paid", url: "https://jasper.ai/art", features: ["Marketing focus", "Brand consistency", "Templates"], rating: 4.4 },
  { name: "Photosonic", description: "AI art generator by Writesonic", category: "image", pricing: "freemium", trialCredits: "10 free credits", url: "https://photosonic.ai", features: ["High quality", "Various styles", "Fast"], rating: 4.2 },
  { name: "BlueWillow", description: "Free Discord-based AI image generator", category: "image", pricing: "free", url: "https://bluewillow.ai", features: ["Free unlimited", "Discord based", "Community"], rating: 4.1 },
  { name: "Pixlr AI", description: "AI image generation with photo editing tools", category: "image", pricing: "freemium", trialCredits: "Free with ads", url: "https://pixlr.com", features: ["Photo editing", "Filters", "Easy to use"], rating: 4.3 },
  { name: "Deep Dream Generator", description: "Trippy psychedelic AI art generator", category: "image", pricing: "freemium", trialCredits: "3 free/day", url: "https://deepdreamgenerator.com", features: ["Psychedelic", "Deep style", "Art styles"], rating: 4.1 },
  { name: "Getimg.ai", description: "AI image generation with custom models", category: "image", pricing: "freemium", trialCredits: "100 free credits", url: "https://getimg.ai", features: ["Custom models", "Outpainting", "Real-time"], rating: 4.4 },
  { name: "Clipdrop", description: "AI image tools suite by Stability AI", category: "image", pricing: "freemium", trialCredits: "Basic free", url: "https://clipdrop.co", features: ["Background removal", "Relight", "Cleanup"], rating: 4.5 },
  
  // Video Creation (15+ tools)
  { name: "Runway", description: "Professional AI video generation and editing suite", category: "video", pricing: "freemium", trialCredits: "125 credits free", url: "https://runway.ml", features: ["Gen-3 video", "Green screen", "Motion brush"], rating: 4.8 },
  { name: "Pika Labs", description: "AI video generation from text and images", category: "video", pricing: "freemium", trialCredits: "250 credits free", url: "https://pika.art", features: ["Text to video", "Image animation", "Style control"], rating: 4.7 },
  { name: "Synthesia", description: "AI video creation with realistic avatars", category: "video", pricing: "paid", url: "https://synthesia.io", features: ["AI avatars", "Multiple languages", "Enterprise"], rating: 4.6 },
  { name: "HeyGen", description: "AI spokesperson videos with custom avatars", category: "video", pricing: "freemium", trialCredits: "1 free video", url: "https://heygen.com", features: ["Custom avatars", "Voice cloning", "Templates"], rating: 4.5 },
  { name: "D-ID", description: "Create talking avatar videos from photos", category: "video", pricing: "freemium", trialCredits: "5 min free", url: "https://d-id.com", features: ["Photo animation", "Voice sync", "API"], rating: 4.4 },
  { name: "Luma AI", description: "Dream Machine for high-quality AI video generation", category: "video", pricing: "freemium", trialCredits: "30 generations/month", url: "https://lumalabs.ai", features: ["Realistic motion", "Fast generation", "High quality"], rating: 4.7 },
  { name: "Kaiber", description: "AI video generation with artistic transformations", category: "video", pricing: "freemium", trialCredits: "60 credits free", url: "https://kaiber.ai", features: ["Music videos", "Art styles", "Transforms"], rating: 4.3 },
  { name: "Invideo AI", description: "Create videos from text prompts automatically", category: "video", pricing: "freemium", trialCredits: "10 min/week free", url: "https://invideo.io", features: ["Text to video", "Templates", "Stock media"], rating: 4.4 },
  { name: "Pictory", description: "Turn scripts and articles into videos", category: "video", pricing: "trial", trialCredits: "3 free videos", url: "https://pictory.ai", features: ["Script to video", "Auto captions", "Editing"], rating: 4.3 },
  { name: "Fliki", description: "Text to video with AI voices", category: "video", pricing: "freemium", trialCredits: "5 min/month free", url: "https://fliki.ai", features: ["AI voices", "Stock media", "Easy editing"], rating: 4.4 },
  { name: "Kapwing", description: "AI-powered video editing platform", category: "video", pricing: "freemium", trialCredits: "Free with watermark", url: "https://kapwing.com", features: ["Subtitles", "Resize", "Collaboration"], rating: 4.4 },
  { name: "Opus Clip", description: "AI video repurposing for short-form content", category: "video", pricing: "freemium", trialCredits: "60 min/month free", url: "https://opus.pro", features: ["Clip extraction", "Virality score", "Auto captions"], rating: 4.6 },
  { name: "Descript", description: "AI video editing with text-based editing", category: "video", pricing: "freemium", trialCredits: "1 hour/month free", url: "https://descript.com", features: ["Text editing", "Overdub", "Screen recording"], rating: 4.6 },
  { name: "Veed.io", description: "Online AI video editor with auto subtitles", category: "video", pricing: "freemium", trialCredits: "10 min free", url: "https://veed.io", features: ["Auto subtitles", "Effects", "Templates"], rating: 4.4 },
  { name: "Colossyan", description: "AI video creation for enterprise training", category: "video", pricing: "paid", url: "https://colossyan.com", features: ["Training videos", "Avatars", "Multi-language"], rating: 4.3 },
  { name: "Elai.io", description: "AI video generation with custom avatars", category: "video", pricing: "freemium", trialCredits: "1 min free", url: "https://elai.io", features: ["Custom avatars", "Templates", "API"], rating: 4.2 },
  { name: "Steve.AI", description: "AI video creation from scripts", category: "video", pricing: "freemium", trialCredits: "3 videos free", url: "https://steve.ai", features: ["Animated videos", "Live videos", "Templates"], rating: 4.2 },

  // Chat & Assistant (15+ tools)
  { name: "ChatGPT", description: "OpenAI's conversational AI, the most popular chatbot", category: "chat", pricing: "freemium", trialCredits: "GPT-3.5 free unlimited", url: "https://chat.openai.com", features: ["GPT-4o", "Plugins", "Code interpreter"], rating: 4.9 },
  { name: "Claude", description: "Anthropic's helpful, harmless AI assistant", category: "chat", pricing: "freemium", trialCredits: "Free tier available", url: "https://claude.ai", features: ["200k context", "Safe", "Analytical"], rating: 4.8 },
  { name: "Google Gemini", description: "Google's multimodal AI assistant", category: "chat", pricing: "freemium", trialCredits: "Free tier available", url: "https://gemini.google.com", features: ["Multimodal", "Google integration", "Real-time"], rating: 4.7 },
  { name: "Perplexity", description: "AI search engine with cited sources", category: "chat", pricing: "freemium", trialCredits: "Free searches unlimited", url: "https://perplexity.ai", features: ["Web search", "Citations", "Pro search"], rating: 4.8 },
  { name: "Microsoft Copilot", description: "AI assistant integrated with Microsoft products", category: "chat", pricing: "freemium", trialCredits: "Free with limits", url: "https://copilot.microsoft.com", features: ["GPT-4", "Bing search", "Office integration"], rating: 4.6 },
  { name: "Pi", description: "Personal AI by Inflection, focused on conversations", category: "chat", pricing: "free", url: "https://pi.ai", features: ["Conversational", "Emotional", "Voice"], rating: 4.4 },
  { name: "Character.AI", description: "Chat with AI characters and personalities", category: "chat", pricing: "freemium", trialCredits: "Free unlimited", url: "https://character.ai", features: ["Characters", "Roleplay", "Custom bots"], rating: 4.5 },
  { name: "Poe", description: "Access multiple AI models in one platform", category: "chat", pricing: "freemium", trialCredits: "Limited free daily", url: "https://poe.com", features: ["Multiple models", "Custom bots", "API"], rating: 4.5 },
  { name: "You.com", description: "AI search and chat with privacy focus", category: "chat", pricing: "freemium", trialCredits: "Free tier available", url: "https://you.com", features: ["Private", "Search", "Multiple modes"], rating: 4.3 },
  { name: "Jasper Chat", description: "AI chat for marketing and business", category: "chat", pricing: "trial", trialCredits: "7-day free trial", url: "https://jasper.ai", features: ["Marketing focus", "Brand voice", "Templates"], rating: 4.4 },
  { name: "HuggingChat", description: "Open-source AI chat by Hugging Face", category: "chat", pricing: "free", url: "https://huggingface.co/chat", features: ["Open source", "Multiple models", "Free"], rating: 4.3 },
  { name: "Llama 2 Chat", description: "Meta's open-source large language model", category: "chat", pricing: "free", url: "https://llama.meta.com", features: ["Open source", "Self-hosted", "Customizable"], rating: 4.4 },
  { name: "Mistral", description: "Fast and efficient open-source AI models", category: "chat", pricing: "freemium", trialCredits: "Free tier available", url: "https://mistral.ai", features: ["Fast", "Efficient", "Open weights"], rating: 4.5 },
  { name: "Cohere", description: "Enterprise AI chat and language models", category: "chat", pricing: "freemium", trialCredits: "Free tier available", url: "https://cohere.com", features: ["Enterprise", "RAG", "Embeddings"], rating: 4.4 },
  { name: "Inflection Pi", description: "Emotional AI for personal conversations", category: "chat", pricing: "free", url: "https://pi.ai", features: ["Empathetic", "Voice chat", "Memory"], rating: 4.3 },

  // Code & Dev (15+ tools)
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
  { name: "Codium AI", description: "AI-powered code testing and review", category: "code", pricing: "freemium", trialCredits: "Free for individuals", url: "https://codium.ai", features: ["Test generation", "Code review", "PR analysis"], rating: 4.4 },
  { name: "Pieces", description: "AI code snippet manager and assistant", category: "code", pricing: "freemium", trialCredits: "Free tier", url: "https://pieces.app", features: ["Snippet manager", "Context capture", "Offline"], rating: 4.3 },
  { name: "Aider", description: "AI pair programming in your terminal", category: "code", pricing: "free", url: "https://aider.chat", features: ["Terminal based", "Git integration", "Open source"], rating: 4.4 },
  { name: "Continue", description: "Open-source AI code assistant", category: "code", pricing: "free", url: "https://continue.dev", features: ["Open source", "Any model", "VS Code"], rating: 4.3 },
  { name: "Bito AI", description: "AI assistant for code understanding", category: "code", pricing: "freemium", trialCredits: "Free tier", url: "https://bito.ai", features: ["Code explanation", "Documentation", "Review"], rating: 4.2 },

  // Audio & Music (15+ tools)
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
  { name: "Play.ht", description: "AI text to speech with realistic voices", category: "audio", pricing: "freemium", trialCredits: "12,500 words free", url: "https://play.ht", features: ["Ultra realistic", "Voice cloning", "API"], rating: 4.5 },
  { name: "Lovo AI", description: "AI voiceover and text to speech platform", category: "audio", pricing: "freemium", trialCredits: "14-day trial", url: "https://lovo.ai", features: ["500+ voices", "Video editing", "Pro voices"], rating: 4.4 },
  { name: "Beatoven.ai", description: "AI music generation for content creators", category: "audio", pricing: "freemium", trialCredits: "5 downloads free", url: "https://beatoven.ai", features: ["Mood-based", "Royalty free", "Customizable"], rating: 4.3 },
  { name: "Boomy", description: "Create original songs in seconds", category: "audio", pricing: "freemium", trialCredits: "Free with limits", url: "https://boomy.com", features: ["Instant songs", "Streaming release", "Monetize"], rating: 4.2 },
  { name: "Amper Music", description: "AI music composition platform", category: "audio", pricing: "paid", url: "https://ampermusic.com", features: ["Custom music", "Enterprise", "API"], rating: 4.3 },
  { name: "Riffusion", description: "AI music generation from text", category: "audio", pricing: "free", url: "https://riffusion.com", features: ["Open source", "Free unlimited", "Spectrograms"], rating: 4.1 },

  // Writing & Content (15+ tools)
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
  { name: "Hypotenuse AI", description: "AI content generation for e-commerce", category: "writing", pricing: "freemium", trialCredits: "15 credits free", url: "https://hypotenuse.ai", features: ["Product descriptions", "Batch generation", "SEO"], rating: 4.3 },
  { name: "Frase", description: "AI SEO content optimization tool", category: "writing", pricing: "trial", trialCredits: "1 free article", url: "https://frase.io", features: ["SEO optimization", "Content briefs", "SERP analysis"], rating: 4.4 },
  { name: "Surfer SEO", description: "AI-powered SEO writing assistant", category: "writing", pricing: "paid", url: "https://surferseo.com", features: ["SEO scoring", "Content editor", "SERP analysis"], rating: 4.5 },
  { name: "Peppertype", description: "AI content generation platform", category: "writing", pricing: "freemium", trialCredits: "10k words free", url: "https://peppertype.ai", features: ["Multiple formats", "Team collaboration", "Templates"], rating: 4.2 },
  { name: "ContentBot", description: "AI content automation tool", category: "writing", pricing: "freemium", trialCredits: "250 words/day free", url: "https://contentbot.ai", features: ["Automation", "Blog posts", "Workflows"], rating: 4.1 },

  // Design & UI (10+ tools)
  { name: "Figma AI", description: "AI-powered design features in Figma", category: "design", pricing: "freemium", trialCredits: "Limited free", url: "https://figma.com", features: ["Auto layout", "Rename layers", "Generate designs"], rating: 4.7 },
  { name: "Framer AI", description: "AI website builder with no-code design", category: "design", pricing: "freemium", trialCredits: "Free tier", url: "https://framer.com", features: ["AI generation", "No code", "Publishing"], rating: 4.6 },
  { name: "Uizard", description: "AI-powered UI design tool", category: "design", pricing: "freemium", trialCredits: "3 projects free", url: "https://uizard.io", features: ["Sketch to design", "Templates", "Prototyping"], rating: 4.4 },
  { name: "Galileo AI", description: "AI UI design generation from text", category: "design", pricing: "trial", trialCredits: "Waitlist", url: "https://galileo.ai", features: ["Text to UI", "Editable", "High fidelity"], rating: 4.5 },
  { name: "Looka", description: "AI logo design and brand kit creator", category: "design", pricing: "freemium", trialCredits: "Free logo preview", url: "https://looka.com", features: ["Logo design", "Brand kit", "Social media"], rating: 4.3 },
  { name: "Brandmark", description: "AI-powered logo design tool", category: "design", pricing: "paid", url: "https://brandmark.io", features: ["Logo generation", "Color palettes", "Typography"], rating: 4.2 },
  { name: "Khroma", description: "AI color palette generator", category: "design", pricing: "free", url: "https://khroma.co", features: ["Color palettes", "Learning AI", "Favorites"], rating: 4.3 },
  { name: "Mokker AI", description: "AI product photo background replacement", category: "design", pricing: "freemium", trialCredits: "Free tier", url: "https://mokker.ai", features: ["Background replacement", "Product photos", "Templates"], rating: 4.4 },
  { name: "Remove.bg", description: "AI background removal tool", category: "design", pricing: "freemium", trialCredits: "1 free/month", url: "https://remove.bg", features: ["Background removal", "API", "Bulk processing"], rating: 4.6 },
  { name: "PhotoRoom", description: "AI photo editing and background removal", category: "design", pricing: "freemium", trialCredits: "Limited free", url: "https://photoroom.com", features: ["Background removal", "Templates", "Batch editing"], rating: 4.5 },

  // Productivity (10+ tools)
  { name: "Otter.ai", description: "AI meeting transcription and notes", category: "productivity", pricing: "freemium", trialCredits: "300 min/month free", url: "https://otter.ai", features: ["Live transcription", "Meeting notes", "Summaries"], rating: 4.6 },
  { name: "Fireflies.ai", description: "AI meeting assistant for transcription", category: "productivity", pricing: "freemium", trialCredits: "800 min storage free", url: "https://fireflies.ai", features: ["Auto-join", "Transcription", "CRM integration"], rating: 4.5 },
  { name: "Mem", description: "AI-powered note-taking app", category: "productivity", pricing: "freemium", trialCredits: "Free tier", url: "https://mem.ai", features: ["Auto-organize", "Search", "Connections"], rating: 4.4 },
  { name: "Taskade", description: "AI-powered productivity workspace", category: "productivity", pricing: "freemium", trialCredits: "Free tier", url: "https://taskade.com", features: ["Task management", "Mind maps", "AI agents"], rating: 4.3 },
  { name: "Motion", description: "AI calendar and task management", category: "productivity", pricing: "trial", trialCredits: "7-day free trial", url: "https://motion.dev", features: ["Auto-scheduling", "Task management", "Calendar"], rating: 4.5 },
  { name: "Reclaim.ai", description: "AI scheduling and time management", category: "productivity", pricing: "freemium", trialCredits: "Free tier", url: "https://reclaim.ai", features: ["Smart scheduling", "Habits", "Calendar sync"], rating: 4.4 },
  { name: "Krisp", description: "AI noise cancellation for calls", category: "productivity", pricing: "freemium", trialCredits: "60 min/day free", url: "https://krisp.ai", features: ["Noise cancellation", "Meeting notes", "Call stats"], rating: 4.5 },
  { name: "Magical", description: "AI text expander and automation", category: "productivity", pricing: "freemium", trialCredits: "Free tier", url: "https://getmagical.com", features: ["Text expansion", "Auto-fill", "Templates"], rating: 4.3 },
  { name: "Zapier AI", description: "AI-powered workflow automation", category: "productivity", pricing: "freemium", trialCredits: "100 tasks/month free", url: "https://zapier.com", features: ["Automation", "AI actions", "5000+ apps"], rating: 4.6 },
  { name: "Bardeen", description: "AI automation for repetitive tasks", category: "productivity", pricing: "freemium", trialCredits: "Free tier", url: "https://bardeen.ai", features: ["Browser automation", "No code", "Workflows"], rating: 4.3 },

  // Education (10+ tools)
  { name: "Khan Academy Khanmigo", description: "AI tutor by Khan Academy", category: "education", pricing: "paid", url: "https://khanacademy.org/khan-labs", features: ["Tutoring", "Math help", "Personalized"], rating: 4.6 },
  { name: "Duolingo Max", description: "AI-powered language learning", category: "education", pricing: "paid", url: "https://duolingo.com", features: ["AI chat", "Explain answers", "Roleplay"], rating: 4.5 },
  { name: "Quizlet AI", description: "AI-powered flashcard and study tool", category: "education", pricing: "freemium", trialCredits: "Free tier", url: "https://quizlet.com", features: ["AI flashcards", "Practice tests", "Learn mode"], rating: 4.4 },
  { name: "Socratic by Google", description: "AI homework helper", category: "education", pricing: "free", url: "https://socratic.org", features: ["Photo solving", "Explanations", "Multiple subjects"], rating: 4.3 },
  { name: "Photomath", description: "AI math problem solver", category: "education", pricing: "freemium", trialCredits: "Basic free", url: "https://photomath.com", features: ["Photo solving", "Step-by-step", "Graphing"], rating: 4.5 },
  { name: "Gradescope", description: "AI grading and feedback tool", category: "education", pricing: "paid", url: "https://gradescope.com", features: ["AI grading", "Feedback", "Analytics"], rating: 4.4 },
  { name: "Brainly", description: "AI-powered homework help community", category: "education", pricing: "freemium", trialCredits: "Limited free", url: "https://brainly.com", features: ["AI answers", "Community", "Explanations"], rating: 4.2 },
  { name: "Synthesis Tutor", description: "AI tutoring for problem-solving", category: "education", pricing: "paid", url: "https://synthesis.com", features: ["Math games", "Problem-solving", "Collaborative"], rating: 4.4 },
  { name: "Speak", description: "AI language learning through conversation", category: "education", pricing: "freemium", trialCredits: "7-day free trial", url: "https://speak.com", features: ["AI conversation", "Speech recognition", "Feedback"], rating: 4.5 },
  { name: "Elsa Speak", description: "AI English pronunciation coach", category: "education", pricing: "freemium", trialCredits: "Free tier", url: "https://elsaspeak.com", features: ["Pronunciation", "AI feedback", "Progress tracking"], rating: 4.4 },

  // Presentations (8+ tools)
  { name: "Tome", description: "AI-powered presentation generator", category: "presentation", pricing: "freemium", trialCredits: "Free tier", url: "https://tome.app", features: ["AI generation", "Beautiful design", "Collaboration"], rating: 4.6 },
  { name: "Gamma", description: "AI presentation and document creator", category: "presentation", pricing: "freemium", trialCredits: "400 credits free", url: "https://gamma.app", features: ["One-click design", "AI content", "Export"], rating: 4.7 },
  { name: "Beautiful.ai", description: "AI-powered presentation design", category: "presentation", pricing: "freemium", trialCredits: "Free tier", url: "https://beautiful.ai", features: ["Smart templates", "Auto-design", "Team features"], rating: 4.5 },
  { name: "Slidesgo AI", description: "AI presentation template generator", category: "presentation", pricing: "freemium", trialCredits: "Free tier", url: "https://slidesgo.com", features: ["Templates", "AI generation", "PowerPoint/Slides"], rating: 4.3 },
  { name: "Pitch", description: "Collaborative presentation software with AI", category: "presentation", pricing: "freemium", trialCredits: "Free tier", url: "https://pitch.com", features: ["Collaboration", "AI drafts", "Analytics"], rating: 4.4 },
  { name: "Decktopus", description: "AI presentation creator", category: "presentation", pricing: "freemium", trialCredits: "Limited free", url: "https://decktopus.com", features: ["AI-powered", "Templates", "Analytics"], rating: 4.2 },
  { name: "SlidesAI", description: "AI add-on for Google Slides", category: "presentation", pricing: "freemium", trialCredits: "3 presentations free", url: "https://slidesai.io", features: ["Google Slides", "AI generation", "Summarize"], rating: 4.3 },
  { name: "Presentations.ai", description: "AI presentation generator", category: "presentation", pricing: "freemium", trialCredits: "Free tier", url: "https://presentations.ai", features: ["AI design", "Templates", "Quick creation"], rating: 4.2 },

  // Data & Research (8+ tools)
  { name: "Elicit", description: "AI research assistant for papers", category: "data", pricing: "freemium", trialCredits: "Free tier", url: "https://elicit.org", features: ["Paper search", "Summarization", "Data extraction"], rating: 4.6 },
  { name: "Consensus", description: "AI-powered academic research search", category: "data", pricing: "freemium", trialCredits: "Free tier", url: "https://consensus.app", features: ["Scientific papers", "AI summaries", "Citations"], rating: 4.5 },
  { name: "Semantic Scholar", description: "AI-powered academic search engine", category: "data", pricing: "free", url: "https://semanticscholar.org", features: ["Paper search", "AI recommendations", "Free"], rating: 4.5 },
  { name: "Scite.ai", description: "Smart citation analysis tool", category: "data", pricing: "freemium", trialCredits: "Free tier", url: "https://scite.ai", features: ["Citation context", "Smart citations", "Dashboard"], rating: 4.4 },
  { name: "ResearchRabbit", description: "AI research discovery tool", category: "data", pricing: "free", url: "https://researchrabbit.ai", features: ["Paper discovery", "Visualizations", "Collections"], rating: 4.5 },
  { name: "Connected Papers", description: "Visual tool for academic research", category: "data", pricing: "freemium", trialCredits: "5 graphs/month free", url: "https://connectedpapers.com", features: ["Paper graphs", "Discovery", "Visual"], rating: 4.4 },
  { name: "Explainpaper", description: "AI tool to explain research papers", category: "data", pricing: "freemium", trialCredits: "Free tier", url: "https://explainpaper.com", features: ["Highlight explain", "Paper upload", "Simple explanations"], rating: 4.3 },
  { name: "ChatPDF", description: "Chat with PDF documents using AI", category: "data", pricing: "freemium", trialCredits: "2 PDFs/day free", url: "https://chatpdf.com", features: ["PDF chat", "Summarization", "Q&A"], rating: 4.4 },

  // Avatars & 3D (8+ tools)
  { name: "Ready Player Me", description: "AI avatar creation platform", category: "avatar", pricing: "freemium", trialCredits: "Free avatars", url: "https://readyplayer.me", features: ["3D avatars", "Cross-platform", "Customizable"], rating: 4.5 },
  { name: "Lensa AI", description: "AI avatar and photo editing app", category: "avatar", pricing: "freemium", trialCredits: "Limited free", url: "https://prisma-ai.com/lensa", features: ["Magic avatars", "Photo editing", "Styles"], rating: 4.3 },
  { name: "Dawn AI", description: "AI avatar generator from photos", category: "avatar", pricing: "freemium", trialCredits: "Limited free", url: "https://dawnai.com", features: ["Photo avatars", "Multiple styles", "High quality"], rating: 4.2 },
  { name: "Kaedim", description: "AI 3D model generation from images", category: "avatar", pricing: "paid", url: "https://kaedim3d.com", features: ["2D to 3D", "Game assets", "Quick generation"], rating: 4.4 },
  { name: "Meshy", description: "AI 3D model and texture generator", category: "avatar", pricing: "freemium", trialCredits: "200 credits free", url: "https://meshy.ai", features: ["Text to 3D", "Textures", "Export formats"], rating: 4.3 },
  { name: "Spline AI", description: "AI 3D design tool", category: "avatar", pricing: "freemium", trialCredits: "Free tier", url: "https://spline.design", features: ["3D design", "AI generation", "Web export"], rating: 4.4 },
  { name: "CSM.ai", description: "AI 3D world and asset generation", category: "avatar", pricing: "freemium", trialCredits: "Free tier", url: "https://csm.ai", features: ["3D worlds", "Game assets", "AI generation"], rating: 4.3 },
  { name: "Masterpiece Studio", description: "AI 3D creation in VR", category: "avatar", pricing: "freemium", trialCredits: "Free tier", url: "https://masterpiecestudio.com", features: ["VR creation", "AI assist", "Animation"], rating: 4.2 },
];

const AITools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"rating" | "name" | "pricing">("rating");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ai-tools-bookmarks");
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("ai-tools-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (toolName: string) => {
    setBookmarks(prev => {
      if (prev.includes(toolName)) {
        toast.success("Removed from favorites");
        return prev.filter(n => n !== toolName);
      }
      toast.success("Added to favorites!");
      return [...prev, toolName];
    });
  };

  const toggleCompare = (toolName: string) => {
    setCompareList(prev => {
      if (prev.includes(toolName)) {
        return prev.filter(n => n !== toolName);
      }
      if (prev.length >= 4) {
        toast.error("You can compare up to 4 tools");
        return prev;
      }
      return [...prev, toolName];
    });
  };

  const filteredTools = useMemo(() => {
    let tools = aiTools.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
      const matchesPricing = selectedPricing === "all" || tool.pricing === selectedPricing;
      const matchesBookmarks = !showBookmarks || bookmarks.includes(tool.name);
      return matchesSearch && matchesCategory && matchesPricing && matchesBookmarks;
    });

    tools.sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "pricing") {
        const order = { free: 0, freemium: 1, trial: 2, paid: 3 };
        return order[a.pricing] - order[b.pricing];
      }
      return 0;
    });

    return tools;
  }, [searchQuery, selectedCategory, selectedPricing, sortBy, showBookmarks, bookmarks]);

  const compareTools = useMemo(() => 
    aiTools.filter(t => compareList.includes(t.name)),
  [compareList]);

  const getPricingBadge = (pricing: string, trialCredits?: string) => {
    const configs: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any; label: string; className: string }> = {
      free: { variant: "secondary", icon: Gift, label: "Free", className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
      freemium: { variant: "secondary", icon: Zap, label: "Freemium", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
      trial: { variant: "secondary", icon: Star, label: "Free Trial", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" },
      paid: { variant: "secondary", icon: DollarSign, label: "Paid", className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
    };
    
    const config = configs[pricing] || configs.paid;
    const Icon = config.icon;
    
    return (
      <div className="flex flex-col gap-1">
        <Badge variant={config.variant} className={`${config.className} border`}>
          <Icon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
        {trialCredits && (
          <span className="text-xs text-muted-foreground">{trialCredits}</span>
        )}
      </div>
    );
  };

  const getCategoryIcon = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.icon || Sparkles;
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || "bg-primary/10 text-primary";
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPricing("all");
    setShowBookmarks(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedPricing !== "all" || showBookmarks;

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-3">
            <Sparkles className="h-3 w-3 mr-1" />
            {aiTools.length}+ AI Tools Directory
          </Badge>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Find the Perfect <span className="text-gradient">AI Tool</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Discover AI tools for image, video, coding, writing, and more.
          </p>
        </div>

        {/* Action Buttons - Bookmarks & Compare */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            variant={showBookmarks ? "default" : "outline"}
            size="sm"
            onClick={() => setShowBookmarks(!showBookmarks)}
            className="gap-1.5"
          >
            <Heart className={`h-4 w-4 ${showBookmarks ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">Favorites</span>
            {bookmarks.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {bookmarks.length}
              </Badge>
            )}
          </Button>
          
          {compareList.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCompareDialog(true)}
              className="gap-1.5"
            >
              <GitCompare className="h-4 w-4" />
              <span className="hidden sm:inline">Compare</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {compareList.length}
              </Badge>
            </Button>
          )}
        </div>

        {/* Search & Filters Bar */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b pb-4 mb-4 -mx-4 px-4">
          <div className="flex flex-col gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Desktop Filter Controls */}
            <div className="hidden md:flex flex-wrap items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <ScrollArea className="h-full">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const count = cat.id === "all" 
                        ? aiTools.length 
                        : aiTools.filter(t => t.category === cat.id).length;
                      return (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{cat.name}</span>
                            <span className="text-xs text-muted-foreground">({count})</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </ScrollArea>
                </SelectContent>
              </Select>

              <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Pricing" />
                </SelectTrigger>
                <SelectContent>
                  {pricingFilters.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <SelectItem key={filter.id} value={filter.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{filter.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="pricing">Free First</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1" />

              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
                <TabsList className="h-9">
                  <TabsTrigger value="grid" className="px-2.5">
                    <Grid3X3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="px-2.5">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Mobile Filter Controls */}
            <div className="flex md:hidden items-center gap-2">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                        {[selectedCategory !== "all", selectedPricing !== "all", showBookmarks].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] flex flex-col">
                  <SheetHeader className="shrink-0">
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Filter AI tools by category and pricing</SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto mt-4 -mx-6 px-6">
                    <div className="space-y-6 pb-4">
                      {/* Category Filter */}
                      <div>
                        <h4 className="font-medium mb-3">Category</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = selectedCategory === cat.id;
                            const count = cat.id === "all" 
                              ? aiTools.length 
                              : aiTools.filter(t => t.category === cat.id).length;
                            return (
                              <Button
                                key={cat.id}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat.id)}
                                className="justify-start h-auto py-2"
                              >
                                <Icon className="h-4 w-4 mr-2 shrink-0" />
                                <span className="truncate">{cat.name}</span>
                                <span className="ml-auto text-xs opacity-70">({count})</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pricing Filter */}
                      <div>
                        <h4 className="font-medium mb-3">Pricing</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {pricingFilters.map((filter) => {
                            const Icon = filter.icon;
                            const isActive = selectedPricing === filter.id;
                            return (
                              <Button
                                key={filter.id}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedPricing(filter.id)}
                                className="justify-start"
                              >
                                <Icon className="h-4 w-4 mr-2" />
                                {filter.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Sort */}
                      <div>
                        <h4 className="font-medium mb-3">Sort By</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "rating", name: "Top Rated" },
                            { id: "name", name: "Name A-Z" },
                            { id: "pricing", name: "Free First" },
                          ].map((sort) => (
                            <Button
                              key={sort.id}
                              variant={sortBy === sort.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSortBy(sort.id as typeof sortBy)}
                            >
                              {sort.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t shrink-0">
                    <Button variant="outline" className="flex-1" onClick={clearFilters}>
                      Clear All
                    </Button>
                    <Button className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
                      Show {filteredTools.length} Results
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
                <TabsList className="h-9">
                  <TabsTrigger value="grid" className="px-2.5">
                    <Grid3X3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="px-2.5">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Quick Category Pills - Desktop */}
        <div className="hidden md:flex flex-wrap gap-2 mb-4">
          {categories.slice(1).map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <Button
                key={cat.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(isActive ? "all" : cat.id)}
              >
                <Icon className="h-3.5 w-3.5 mr-1.5" />
                {cat.name}
              </Button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {showBookmarks && <span className="text-primary font-medium">Favorites: </span>}
            <span className="font-semibold text-foreground">{filteredTools.length}</span> tools
          </p>
        </div>

        {/* Tools Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredTools.map((tool, index) => {
              const CategoryIcon = getCategoryIcon(tool.category);
              const categoryColor = getCategoryColor(tool.category);
              const isBookmarked = bookmarks.includes(tool.name);
              const isComparing = compareList.includes(tool.name);
              return (
                <Card 
                  key={index} 
                  className={`group hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col ${isComparing ? "ring-2 ring-primary" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2">
                      <div className={`p-2 rounded-lg ${categoryColor} shrink-0`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">{tool.name}</CardTitle>
                        {tool.rating && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">{tool.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => toggleBookmark(tool.name)}
                        >
                          <Heart className={`h-4 w-4 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => toggleCompare(tool.name)}
                        >
                          {isComparing ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <GitCompare className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col pt-0">
                    <div className="mb-2">
                      {getPricingBadge(tool.pricing, tool.trialCredits)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2 flex-1">
                      {tool.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {tool.features.slice(0, 2).map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full h-8 text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={() => window.open(tool.url, "_blank")}
                    >
                      Visit
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTools.map((tool, index) => {
              const CategoryIcon = getCategoryIcon(tool.category);
              const categoryColor = getCategoryColor(tool.category);
              const isBookmarked = bookmarks.includes(tool.name);
              const isComparing = compareList.includes(tool.name);
              return (
                <Card key={index} className={`hover:border-primary/50 transition-all ${isComparing ? "ring-2 ring-primary" : ""}`}>
                  <div className="flex items-center gap-3 p-3">
                    <div className={`p-2 rounded-lg ${categoryColor} shrink-0`}>
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
                        {tool.rating && (
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">{tool.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                    </div>
                    <div className="hidden sm:block shrink-0">
                      {getPricingBadge(tool.pricing)}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleBookmark(tool.name)}
                      >
                        <Heart className={`h-4 w-4 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleCompare(tool.name)}
                      >
                        {isComparing ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <GitCompare className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8"
                        onClick={() => window.open(tool.url, "_blank")}
                      >
                        Visit
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-muted inline-block mb-4">
              {showBookmarks ? (
                <Heart className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Search className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {showBookmarks ? "No favorites yet" : "No tools found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {showBookmarks ? "Click the heart icon to save tools" : "Try adjusting your filters"}
            </p>
            <Button variant="outline" onClick={clearFilters}>
              {showBookmarks ? "Browse All Tools" : "Clear all filters"}
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-10 grid grid-cols-3 md:grid-cols-6 gap-2">
          <Card className="text-center p-3">
            <div className="text-xl font-bold text-primary">{aiTools.length}+</div>
            <div className="text-[10px] text-muted-foreground">Total</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-xl font-bold text-green-500">
              {aiTools.filter(t => t.pricing === "free").length}
            </div>
            <div className="text-[10px] text-muted-foreground">Free</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-xl font-bold text-blue-500">
              {aiTools.filter(t => t.pricing === "freemium").length}
            </div>
            <div className="text-[10px] text-muted-foreground">Freemium</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-xl font-bold text-yellow-500">
              {aiTools.filter(t => t.pricing === "trial").length}
            </div>
            <div className="text-[10px] text-muted-foreground">Trial</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-xl font-bold text-purple-500">
              {aiTools.filter(t => t.pricing === "paid").length}
            </div>
            <div className="text-[10px] text-muted-foreground">Paid</div>
          </Card>
          <Card className="text-center p-3">
            <div className="text-xl font-bold text-accent">{categories.length - 1}</div>
            <div className="text-[10px] text-muted-foreground">Categories</div>
          </Card>
        </div>
      </div>

      {/* Compare Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Compare AI Tools ({compareList.length}/4)
            </DialogTitle>
            <DialogDescription>
              Compare features, pricing, and ratings side by side
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {compareTools.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Select tools to compare using the compare icon</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Feature</th>
                      {compareTools.map(tool => (
                        <th key={tool.name} className="text-left p-3 min-w-[150px]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold">{tool.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleCompare(tool.name)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Category</td>
                      {compareTools.map(tool => (
                        <td key={tool.name} className="p-3">{getCategoryName(tool.category)}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Pricing</td>
                      {compareTools.map(tool => (
                        <td key={tool.name} className="p-3">
                          {getPricingBadge(tool.pricing, tool.trialCredits)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Rating</td>
                      {compareTools.map(tool => (
                        <td key={tool.name} className="p-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{tool.rating || "N/A"}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Description</td>
                      {compareTools.map(tool => (
                        <td key={tool.name} className="p-3 text-muted-foreground">{tool.description}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Features</td>
                      {compareTools.map(tool => (
                        <td key={tool.name} className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {tool.features.map((f, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Link</td>
                      {compareTools.map(tool => (
                        <td key={tool.name} className="p-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(tool.url, "_blank")}
                          >
                            Visit <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </ScrollArea>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setCompareList([])}>
              Clear All
            </Button>
            <Button onClick={() => setShowCompareDialog(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AITools;
