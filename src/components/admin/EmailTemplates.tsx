import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  PartyPopper, 
  Bell, 
  Megaphone, 
  Gift, 
  BookOpen 
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  subject: string;
  content: string;
}

const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome New Users",
    description: "Welcome message for newly registered users",
    icon: <PartyPopper className="h-5 w-5" />,
    subject: "🎉 Welcome to Pruthvi's Lab - Let's Get Started!",
    content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 30px; color: #888; font-size: 13px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Pruthvi's Lab!</h1>
    </div>
    <div class="content">
      <p>Hi there! 👋</p>
      <p>We're thrilled to have you join our community of developers and learners!</p>
      <p><strong>Here's what you can explore:</strong></p>
      <ul>
        <li>📚 In-depth tutorials and guides</li>
        <li>💻 Ready-to-use code snippets</li>
        <li>🤖 AI-powered coding assistant</li>
        <li>🛠️ Curated AI tools directory</li>
        <li>👥 Active developer community</li>
      </ul>
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://pruthvislab.com" class="button">Start Exploring →</a>
      </p>
    </div>
    <div class="footer">
      <p>Happy coding! 💜</p>
      <p><strong>The Pruthvi's Lab Team</strong></p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: "newsletter",
    name: "Weekly Newsletter",
    description: "Weekly updates and new content announcement",
    icon: <Bell className="h-5 w-5" />,
    subject: "📬 This Week at Pruthvi's Lab - New Tutorials & Updates!",
    content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .section { background: #f8f5ff; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 30px; color: #888; font-size: 13px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 Weekly Newsletter</h1>
      <p>Your weekly dose of learning & updates</p>
    </div>
    <div class="content">
      <p>Hi Developer! 👋</p>
      <p>Here's what's new this week at Pruthvi's Lab:</p>
      
      <div class="section">
        <h3>🆕 New Tutorials</h3>
        <p>Check out our latest tutorials covering React, TypeScript, and more!</p>
      </div>
      
      <div class="section">
        <h3>💻 New Code Snippets</h3>
        <p>Fresh code snippets added to help you code faster and smarter.</p>
      </div>
      
      <div class="section">
        <h3>🤖 AI Tools Update</h3>
        <p>Discover the newest AI tools added to our directory.</p>
      </div>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://pruthvislab.com" class="button">Read More →</a>
      </p>
    </div>
    <div class="footer">
      <p>Happy coding! 💜</p>
      <p><strong>The Pruthvi's Lab Team</strong></p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: "announcement",
    name: "Important Announcement",
    description: "Major updates or platform announcements",
    icon: <Megaphone className="h-5 w-5" />,
    subject: "📢 Important Announcement from Pruthvi's Lab",
    content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .highlight { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 30px; color: #888; font-size: 13px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📢 Important Announcement</h1>
    </div>
    <div class="content">
      <p>Dear Community Member,</p>
      
      <div class="highlight">
        <p><strong>⚠️ Important Update:</strong></p>
        <p>[Your announcement message here]</p>
      </div>
      
      <p>We wanted to share some important news with you...</p>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://pruthvislab.com" class="button">Learn More →</a>
      </p>
    </div>
    <div class="footer">
      <p>Thank you for being part of our community! 💜</p>
      <p><strong>The Pruthvi's Lab Team</strong></p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: "promotion",
    name: "Special Offer",
    description: "Promotions, discounts, or special deals",
    icon: <Gift className="h-5 w-5" />,
    subject: "🎁 Special Offer Just for You - Limited Time!",
    content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; text-align: center; }
    .offer-box { background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 30px; border-radius: 16px; margin: 20px 0; }
    .offer-box h2 { margin: 0; font-size: 48px; }
    .button { display: inline-block; background: white; color: #7C3AED; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 30px; color: #888; font-size: 13px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎁 Special Offer!</h1>
      <p>Limited time only</p>
    </div>
    <div class="content">
      <p>Hey there! 👋</p>
      <p>We have something special just for you...</p>
      
      <div class="offer-box">
        <p style="margin: 0; opacity: 0.9;">Get up to</p>
        <h2>50% OFF</h2>
        <p style="margin: 0; opacity: 0.9;">on Premium Tutorials & Materials</p>
      </div>
      
      <p>Use code: <strong>SPECIAL50</strong></p>
      <p style="color: #888;">*Offer valid until [Date]</p>
      
      <p style="margin-top: 30px;">
        <a href="https://pruthvislab.com/materials" class="button">Claim Offer →</a>
      </p>
    </div>
    <div class="footer">
      <p>Happy learning! 💜</p>
      <p><strong>The Pruthvi's Lab Team</strong></p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: "new-content",
    name: "New Content Alert",
    description: "Notify users about new tutorials or materials",
    icon: <BookOpen className="h-5 w-5" />,
    subject: "🆕 New Tutorial Published - Check It Out!",
    content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .tutorial-card { background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .tag { display: inline-block; background: #7C3AED; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-right: 8px; }
    .button { display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 30px; color: #888; font-size: 13px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🆕 New Content Alert!</h1>
      <p>Fresh learning material just for you</p>
    </div>
    <div class="content">
      <p>Hey Developer! 👋</p>
      <p>We just published something you might love:</p>
      
      <div class="tutorial-card">
        <h3 style="margin-top: 0;">[Tutorial Title]</h3>
        <p style="color: #666;">[Brief description of the tutorial]</p>
        <div>
          <span class="tag">React</span>
          <span class="tag">TypeScript</span>
          <span class="tag">Beginner</span>
        </div>
      </div>
      
      <p><strong>What you'll learn:</strong></p>
      <ul>
        <li>Key concept 1</li>
        <li>Key concept 2</li>
        <li>Key concept 3</li>
      </ul>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://pruthvislab.com/tutorials" class="button">Start Learning →</a>
      </p>
    </div>
    <div class="footer">
      <p>Keep building amazing things! 💜</p>
      <p><strong>The Pruthvi's Lab Team</strong></p>
    </div>
  </div>
</body>
</html>`,
  },
];

interface EmailTemplatesProps {
  onSelectTemplate: (subject: string, content: string) => void;
}

export function EmailTemplates({ onSelectTemplate }: EmailTemplatesProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {emailTemplates.map((template) => (
        <Card 
          key={template.id} 
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => onSelectTemplate(template.subject, template.content)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {template.icon}
              </div>
              <CardTitle className="text-sm">{template.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs">
              {template.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { emailTemplates };
