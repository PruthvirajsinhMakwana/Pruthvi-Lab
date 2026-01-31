import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Sparkles, Lock, Zap, BookOpen, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface LoginPopupProps {
  delayInSeconds?: number;
}

export function LoginPopup({ delayInSeconds = 60 }: LoginPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if popup was dismissed in this session
    const dismissed = sessionStorage.getItem("login_popup_dismissed");
    if (dismissed) {
      return;
    }

    // Don't show if user is logged in or still loading
    if (loading) return;
    
    // If user is logged in, never show popup
    if (user) {
      setIsVisible(false);
      return;
    }

    // Show popup after delay only for non-logged-in users
    const timer = setTimeout(() => {
      // Double check user is still not logged in
      setIsVisible(true);
    }, delayInSeconds * 1000);

    return () => clearTimeout(timer);
  }, [user, loading, delayInSeconds]);

  // Hide popup immediately when user logs in
  useEffect(() => {
    if (user) {
      setIsVisible(false);
    }
  }, [user]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("login_popup_dismissed", "true");
  };

  const handleSignIn = () => {
    handleDismiss();
    navigate("/auth?mode=signin");
  };

  const handleSignUp = () => {
    handleDismiss();
    navigate("/auth?mode=signup");
  };

  if (!isVisible || user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      
      {/* Popup Content */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-background via-background to-primary/5 border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25 mx-auto">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Join Pruthvi's Lab
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Unlock exclusive features and take your learning to the next level!
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">AI Tools</p>
                <p className="text-xs text-muted-foreground">400+ Free Tools</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Tutorials</p>
                <p className="text-xs text-muted-foreground">Learn & Grow</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Code className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Code Library</p>
                <p className="text-xs text-muted-foreground">Copy & Use</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Save Items</p>
                <p className="text-xs text-muted-foreground">Bookmark Favorites</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleSignUp}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
            >
              Create Free Account
            </Button>
            <Button 
              onClick={handleSignIn}
              variant="outline" 
              className="w-full h-12 text-base"
            >
              I Already Have an Account
            </Button>
          </div>

          {/* Skip Link */}
          <button
            onClick={handleDismiss}
            className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
