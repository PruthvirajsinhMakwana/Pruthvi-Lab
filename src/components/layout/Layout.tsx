import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { usePageTracking } from "@/hooks/usePageTracking";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  // Track page views for analytics
  usePageTracking();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
