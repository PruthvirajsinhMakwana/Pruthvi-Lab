import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { SEOHead } from "@/components/SEOHead";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import PublicProfile from "./pages/PublicProfile";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import Tutorials from "./pages/Tutorials";
import TutorialPage from "./pages/TutorialPage";
import CodeLibrary from "./pages/CodeLibrary";
import Materials from "./pages/Materials";
import Community from "./pages/Community";
import AIAssistant from "./pages/AIAssistant";
import AITools from "./pages/AITools";
import FullscreenChat from "./pages/FullscreenChat";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminTutorials from "./pages/admin/AdminTutorials";
import AdminTutorialPurchases from "./pages/admin/AdminTutorialPurchases";
import AdminSnippets from "./pages/admin/AdminSnippets";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminMaterialPurchases from "./pages/admin/AdminMaterialPurchases";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminActivityLogs from "./pages/admin/AdminActivityLogs";
import AdminCommunity from "./pages/admin/AdminCommunity";
import AdminSEO from "./pages/admin/AdminSEO";
import AdminMarketing from "./pages/admin/AdminMarketing";
import MyPurchases from "./pages/MyPurchases";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <SEOHead />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <Library />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-purchases"
                element={
                  <ProtectedRoute>
                    <MyPurchases />
                  </ProtectedRoute>
                }
              />
              <Route path="/user/:userId" element={<PublicProfile />} />
              
              {/* Public Content Routes */}
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogPost />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/tutorials/:slug" element={<TutorialPage />} />
              <Route path="/code-library" element={<CodeLibrary />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/community" element={<Community />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/chat" element={<FullscreenChat />} />
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs"
                element={
                  <AdminProtectedRoute>
                    <AdminBlogs />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/tutorials"
                element={
                  <AdminProtectedRoute>
                    <AdminTutorials />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/tutorial-purchases"
                element={
                  <AdminProtectedRoute>
                    <AdminTutorialPurchases />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/snippets"
                element={
                  <AdminProtectedRoute>
                    <AdminSnippets />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/materials"
                element={
                  <AdminProtectedRoute>
                    <AdminMaterials />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/material-purchases"
                element={
                  <AdminProtectedRoute>
                    <AdminMaterialPurchases />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminProtectedRoute>
                    <AdminAnalytics />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/activity-logs"
                element={
                  <AdminProtectedRoute>
                    <AdminActivityLogs />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/community"
                element={
                  <AdminProtectedRoute>
                    <AdminCommunity />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/seo"
                element={
                  <AdminProtectedRoute>
                    <AdminSEO />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/marketing"
                element={
                  <AdminProtectedRoute>
                    <AdminMarketing />
                  </AdminProtectedRoute>
                }
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
