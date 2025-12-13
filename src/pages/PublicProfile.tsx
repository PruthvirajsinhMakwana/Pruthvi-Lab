import { useParams } from "react-router-dom";
import { User, Calendar, Sparkles, BookOpen } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { profile, loading } = useProfile(userId);

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 lg:px-8 max-w-3xl">
          <div className="flex flex-col items-center mb-8">
            <Skeleton className="h-32 w-32 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-48" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 lg:px-8 text-center">
          <User className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="font-heading text-2xl font-semibold text-foreground mb-2">
            Profile Not Found
          </h1>
          <p className="text-muted-foreground">
            This user profile doesn't exist or has been removed.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:px-8 max-w-3xl">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
              {getInitials(profile.full_name, profile.email)}
            </AvatarFallback>
          </Avatar>
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
            {profile.full_name || "Anonymous User"}
          </h1>
          {profile.bio && (
            <p className="text-muted-foreground mt-2 max-w-md">
              {profile.bio}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Joined {new Date(profile.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="grid gap-6">
          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="outline">
                      {interest.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skill Level */}
          {profile.skill_level && (
            <Card>
              <CardHeader>
                <CardTitle>Experience Level</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="default" className="capitalize">
                  {profile.skill_level}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
