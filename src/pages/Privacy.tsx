import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, Database, Cookie, Mail } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Account information (email, name) when you register",
        "Usage data (pages visited, features used)",
        "Device information (browser type, IP address)",
        "Content you create (comments, messages)",
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our services",
        "To notify you about changes to our services",
        "To provide customer support",
        "To detect and prevent technical issues",
        "To send you updates about new content (with your consent)",
      ],
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        "We use industry-standard encryption (SSL/TLS)",
        "Passwords are hashed and never stored in plain text",
        "Regular security audits and updates",
        "Limited access to personal data by staff",
      ],
    },
    {
      icon: Users,
      title: "Sharing Your Information",
      content: [
        "We do NOT sell your personal information",
        "We may share data with service providers who assist us",
        "We may disclose data if required by law",
        "Anonymized data may be used for analytics",
      ],
    },
    {
      icon: Database,
      title: "Data Retention",
      content: [
        "Account data is retained while your account is active",
        "You can request deletion of your data at any time",
        "Backup data is retained for up to 30 days",
        "Activity logs are retained for security purposes",
      ],
    },
    {
      icon: Cookie,
      title: "Cookies",
      content: [
        "We use essential cookies for authentication",
        "Analytics cookies help us improve our services",
        "You can disable cookies in your browser settings",
        "Third-party services may use their own cookies",
      ],
    },
  ];

  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              At Dev API Learn (operated by Pruthvirajsinh Makwana), we are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our 
              website and services.
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
              <h3 className="font-heading font-semibold">Contact Us</h3>
            </div>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{" "}
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
