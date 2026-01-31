import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, Scale, Users, Ban, RefreshCw, Mail } from "lucide-react";

export default function Terms() {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Dev API Learn, you agree to these Terms of Service",
        "If you do not agree to these terms, please do not use our services",
        "We reserve the right to modify these terms at any time",
        "Continued use after changes constitutes acceptance of new terms",
      ],
    },
    {
      icon: Users,
      title: "User Accounts",
      content: [
        "You must provide accurate information when creating an account",
        "You are responsible for maintaining your account security",
        "You must be at least 13 years old to use our services",
        "One person may not maintain more than one account",
      ],
    },
    {
      icon: Scale,
      title: "Acceptable Use",
      content: [
        "Use our services only for lawful purposes",
        "Do not attempt to gain unauthorized access to our systems",
        "Do not distribute malware or harmful content",
        "Do not harass, abuse, or harm other users",
        "Do not use automated systems to scrape content without permission",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Content Disclaimer",
      content: [
        "Educational content is provided 'as is' without warranties",
        "We do not guarantee accuracy or completeness of content",
        "Third-party resources linked are not under our control",
        "Free Resources section is for educational purposes only",
        "Users are responsible for compliance with local laws",
      ],
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      content: [
        "Reselling or redistributing paid content without permission",
        "Using our platform for illegal activities",
        "Impersonating other users or administrators",
        "Uploading copyrighted content without authorization",
        "Attempting to bypass payment systems",
      ],
    },
    {
      icon: RefreshCw,
      title: "Purchases & Refunds",
      content: [
        "All purchases require manual approval by administrators",
        "Refunds are handled on a case-by-case basis",
        "Digital content purchases are generally non-refundable",
        "Contact support within 7 days for refund requests",
      ],
    },
  ];

  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Dev API Learn. These Terms of Service govern your use of our website and services. 
              By using our platform, you agree to be bound by these terms.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <section.icon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-semibold">Questions?</h3>
            </div>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:pruthvirajsinh.biz@gmail.com" className="text-primary hover:underline">
                pruthvirajsinh.biz@gmail.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
