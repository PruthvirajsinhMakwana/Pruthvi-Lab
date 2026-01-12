import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const interests = [
  { id: "web-dev", label: "Web Development", icon: "🌐" },
  { id: "mobile", label: "Mobile Development", icon: "📱" },
  { id: "backend", label: "Backend & APIs", icon: "⚙️" },
  { id: "ai-ml", label: "AI & Machine Learning", icon: "🤖" },
  { id: "devops", label: "DevOps & Cloud", icon: "☁️" },
  { id: "security", label: "Security", icon: "🔐" },
  { id: "data", label: "Data Science", icon: "📊" },
  { id: "design", label: "UI/UX Design", icon: "🎨" },
];

const skillLevels = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Just starting out, learning the basics",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Comfortable with fundamentals, building projects",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Experienced, working on complex systems",
  },
];

const goals = [
  { id: "career", label: "Career Change", icon: "💼" },
  { id: "upskill", label: "Upskilling", icon: "📈" },
  { id: "hobby", label: "Hobby / Side Projects", icon: "🎯" },
  { id: "freelance", label: "Freelancing", icon: "💻" },
  { id: "startup", label: "Building a Startup", icon: "🚀" },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          interests: selectedInterests,
          skill_level: selectedSkillLevel as "beginner" | "intermediate" | "advanced",
          learning_goals: selectedGoals,
          phone_number: phoneNumber || null,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile setup complete!",
        description: "We've personalized your experience based on your preferences.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedInterests.length > 0;
      case 2:
        return selectedSkillLevel !== "";
      case 3:
        return selectedGoals.length > 0;
      case 4:
        return true; // Phone is optional
      default:
        return false;
    }
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border py-4 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-bold text-sm">
            PL
          </div>
          <span className="font-heading font-semibold text-lg text-foreground">
            Pruthvi's Lab
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted h-1">
        <div
          className="bg-primary h-1 transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Step 1: Interests */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
                  What are you interested in learning?
                </h1>
                <p className="text-muted-foreground mt-2">
                  Select all that apply. We'll personalize your content.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                      selectedInterests.includes(interest.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    {selectedInterests.includes(interest.id) && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    <span className="text-2xl block mb-2">{interest.icon}</span>
                    <span className="text-sm font-medium text-foreground">
                      {interest.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Skill Level */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
                  What's your current skill level?
                </h1>
                <p className="text-muted-foreground mt-2">
                  This helps us recommend the right content for you.
                </p>
              </div>
              <div className="space-y-3 max-w-md mx-auto">
                {skillLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedSkillLevel(level.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedSkillLevel === level.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-foreground">
                          {level.label}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {level.description}
                        </p>
                      </div>
                      {selectedSkillLevel === level.id && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
                  What are your learning goals?
                </h1>
                <p className="text-muted-foreground mt-2">
                  Select all that apply to your situation.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      selectedGoals.includes(goal.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    <span className="text-xl">{goal.icon}</span>
                    <span className="font-medium text-foreground">{goal.label}</span>
                    {selectedGoals.includes(goal.id) && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Phone Number (Optional) */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
                  Stay connected
                </h1>
                <p className="text-muted-foreground mt-2">
                  Optionally add your phone number for important updates
                </p>
              </div>
              <div className="max-w-md mx-auto space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 9876543210"
                    className="text-center text-lg"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    We'll only use this for important updates and exclusive offers
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex justify-between items-center max-w-md mx-auto">
            {step > 1 ? (
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
              >
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                disabled={isLoading}
              >
                Skip for now
              </Button>
            )}
            {step < totalSteps ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                {step === 3 ? "Next" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
