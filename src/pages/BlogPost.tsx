import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Bookmark, BookmarkCheck, Share2, Clock, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentSection } from "@/components/comments/CommentSection";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useAuth } from "@/contexts/AuthContext";
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading } = useBlogPost(slug || "");
  const { user } = useAuth();
  const { saveItem, unsaveItem, isItemSaved } = useSavedItems();

  const isSaved = blog ? isItemSaved(blog.id, "blog") : false;

  const handleSaveToggle = async () => {
    if (!blog) return;
    if (isSaved) {
      await unsaveItem(blog.id, "blog");
    } else {
      await saveItem(blog.id, "blog");
    }
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      await navigator.share({
        title: blog.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="aspect-video w-full mb-8 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Blog post not found</h1>
          <p className="text-muted-foreground mb-8">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/blogs">Back to Blogs</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Estimate reading time
  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Layout>
      <article className="min-h-screen">
        {/* Hero Section */}
        <div className="relative">
          {/* Featured Image with Overlay */}
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            {blog.featured_image ? (
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          {/* Header Content */}
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="relative -mt-32 md:-mt-40 pb-8">
              {/* Back Link */}
              <Link
                to="/blogs"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Link>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              {/* Author & Meta Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src={blog.author?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {blog.author?.full_name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {blog.author?.full_name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {blog.published_at && (
                        <span>{format(new Date(blog.published_at), "MMM d, yyyy")}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {readingTime} min read
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {user && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSaveToggle}
                      className="gap-2"
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-4xl py-8">
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-ul:my-4 prose-ul:space-y-2
            prose-ol:my-4 prose-ol:space-y-2
            prose-li:text-muted-foreground
            prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl
            prose-img:rounded-xl prose-img:shadow-lg
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {blog.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user && (
                  <Button 
                    variant={isSaved ? "default" : "outline"} 
                    size="sm" 
                    onClick={handleSaveToggle}
                    className="gap-2"
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        Save for later
                      </>
                    )}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share article
                </Button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection contentType="blog" contentId={blog.id} />
        </div>
      </article>
    </Layout>
  );
}
