import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, User, LogOut, Settings, Bookmark, LayoutDashboard, ChevronDown, BookOpen, Code, FileText, Package, Users, ShoppingBag, Bot, Sparkles, MessageCircle, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { SearchButton } from "@/components/search/SearchDialog";
import { cn } from "@/lib/utils";

const mainNavigation = [
  { name: "Home", href: "/", icon: null },
  { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
  { name: "AI Studio", href: "/ai-studio", icon: Wand2 },
  { name: "AI Tools", href: "/ai-tools", icon: Sparkles },
  { name: "Community", href: "/community", icon: Users },
];

const resourcesNavigation = [
  { name: "Blogs", href: "/blogs", icon: FileText, description: "Articles and insights" },
  { name: "Tutorials", href: "/tutorials", icon: BookOpen, description: "Step-by-step guides" },
  { name: "Code Library", href: "/code-library", icon: Code, description: "Reusable code snippets" },
  { name: "Materials", href: "/materials", icon: Package, description: "Learning resources" },
];

const mobileUserNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Library", href: "/library", icon: Bookmark },
  { name: "My Purchases", href: "/my-purchases", icon: ShoppingBag },
  { name: "Profile", href: "/profile", icon: User },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name?: string | null, email?: string) => {
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

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <>
    <header className="sticky top-0 z-[100] w-full border-b border-border/50 glass">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground font-heading font-bold text-sm shadow-glow group-hover:scale-105 transition-transform">
              PL
            </div>
            <span className="font-heading font-bold text-xl text-foreground hidden sm:block">
              Pruthvi's Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                  isActive(item.href)
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted data-[state=open]:bg-muted">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-1 p-2">
                      {resourcesNavigation.map((item) => (
                        <li key={item.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted",
                                isActive(item.href) && "bg-muted"
                              )}
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <item.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {item.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:block">
            <SearchButton />
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground hover:bg-muted h-9 w-9"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Menu or Auth Buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name || user.email}
                    />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                      {getInitials(user.user_metadata?.full_name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    {user.user_metadata?.full_name && (
                      <p className="font-medium text-sm text-foreground">
                        {user.user_metadata.full_name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/library" className="cursor-pointer">
                    <Bookmark className="mr-2 h-4 w-4" />
                    My Library
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-purchases" className="cursor-pointer">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Purchases
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Desktop Auth Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity" asChild>
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </div>
              {/* Mobile Auth Button - Show login icon on mobile */}
              <div className="flex items-center gap-1 sm:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                  <Link to="/chat">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                  <Link to="/auth">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          )}

          {/* Mobile Menu Button - Always last for far-right position */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            type="button"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>
    </header>

    {/* Mobile Menu Panel - Outside header to avoid stacking context issues */}
    {mobileMenuOpen && (
      <div 
        className="lg:hidden fixed inset-0 top-16 z-[9999] bg-background"
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        <div className="h-full w-full overflow-y-auto border-t border-border/50">
          <div className="container mx-auto px-4 py-4 space-y-4 pb-24">
            {/* Mobile Search */}
            <div className="md:hidden">
              <SearchButton className="w-full" />
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-1">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg transition-colors",
                    isActive(item.href)
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Resources Section */}
            <div className="border-t border-border pt-4">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Resources
              </p>
              <div className="grid grid-cols-2 gap-2">
                {resourcesNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      isActive(item.href)
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile User Links */}
            {user && (
              <div className="border-t border-border pt-4">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Account
                </p>
                <div className="space-y-1">
                  {mobileUserNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                        isActive(item.href)
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Link */}
            {isAdmin && (
              <div className="border-t border-border pt-4">
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Panel
                </Link>
              </div>
            )}

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="border-t border-border pt-4 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button className="w-full bg-gradient-primary" asChild>
                  <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}

            {/* Sign Out for logged in users */}
            {user && (
              <div className="border-t border-border pt-4">
                <Button 
                  variant="outline" 
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
