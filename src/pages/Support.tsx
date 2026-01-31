import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { HelpCircle, MessageCircle, Ticket, BookOpen, Zap, Shield, CreditCard } from "lucide-react";

const faqs = [
  {
    question: "How do I access paid tutorials after purchase?",
    answer: "After your purchase is approved by an admin, you can access the tutorial from the 'My Purchases' section in your dashboard. You'll also receive an email confirmation."
  },
  {
    question: "How long does purchase approval take?",
    answer: "Purchase approvals are typically processed within 24 hours. For faster approval, make sure your transaction ID is correct and clearly visible in your payment screenshot."
  },
  {
    question: "Can I get a refund?",
    answer: "We offer refunds on a case-by-case basis. If you're unsatisfied with a tutorial or material, please contact support with your reason and we'll review your request."
  },
  {
    question: "How do I reset my password?",
    answer: "Go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a password reset link."
  },
  {
    question: "Are the resources on the Free Resources page legal?",
    answer: "Our Free Resources page is for educational purposes only. We curate links from publicly available sources. Users are responsible for ensuring compliance with their local laws."
  },
  {
    question: "How can I become a contributor?",
    answer: "We welcome contributors! Contact us through the Contact page with your portfolio and areas of expertise. We'll review your application and get back to you."
  },
];

const supportCategories = [
  { value: "account", label: "Account Issues" },
  { value: "purchase", label: "Purchase / Payment" },
  { value: "technical", label: "Technical Problem" },
  { value: "content", label: "Content Request" },
  { value: "bug", label: "Bug Report" },
  { value: "other", label: "Other" },
];

export default function Support() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    category: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke("notify-telegram-activity", {
        body: {
          type: "support",
          userName: formData.name,
          userEmail: formData.email,
          subject: `[${formData.category.toUpperCase()}] ${formData.subject}`,
          message: formData.message,
          details: {
            category: formData.category,
            userId: user?.id || "Guest",
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Support Request Submitted!",
        description: "We've received your request and will respond soon.",
      });

      setFormData({ ...formData, category: "", subject: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4">Support Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Need help? Browse our FAQs or submit a support request.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BookOpen, title: "Tutorials", desc: "Browse tutorials", href: "/tutorials" },
            { icon: Zap, title: "AI Tools", desc: "Explore AI features", href: "/ai-studio" },
            { icon: Shield, title: "Resources", desc: "Free resources", href: "/resources" },
            { icon: CreditCard, title: "Purchases", desc: "My purchases", href: "/my-purchases" },
          ].map((item) => (
            <Card key={item.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = item.href}>
              <CardContent className="pt-6 text-center">
                <item.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Support Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Submit a Support Request
              </CardTitle>
              <CardDescription>
                Can't find an answer? Submit a ticket and we'll help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="Brief summary of your issue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Description *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder="Please describe your issue in detail..."
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading || !formData.category}>
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Help */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <MessageCircle className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-heading font-semibold text-lg">Need Faster Help?</h3>
                  <p className="text-muted-foreground">Join our Telegram community for quick assistance</p>
                </div>
              </div>
              <Button asChild>
                <a href="https://t.me/BAPU_EMPIRE" target="_blank" rel="noopener noreferrer">
                  Join Telegram
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
