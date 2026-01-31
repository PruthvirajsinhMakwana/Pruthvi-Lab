import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name?: string;
  type: "signup" | "login";
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY is not configured");
      throw new Error("Email service not configured");
    }

    const { email, name, type }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Sending ${type} email to: ${email}`);

    const userName = name || email.split("@")[0];
    const isSignup = type === "signup";

    const subject = isSignup 
      ? `🎉 Welcome to Pruthvi's Lab, ${userName}!`
      : `👋 Welcome back to Pruthvi's Lab!`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
          }
          .header { 
            background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            border-radius: 16px 16px 0 0; 
          }
          .logo {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 16px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 8px 0 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content { 
            background: #ffffff; 
            padding: 40px 30px; 
            border-radius: 0 0 16px 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
          .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 16px;
          }
          .message {
            color: #666;
            font-size: 16px;
            margin-bottom: 24px;
          }
          .features {
            background: #f8f5ff;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
          }
          .features h3 {
            color: #7C3AED;
            margin: 0 0 16px;
            font-size: 18px;
          }
          .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            color: #555;
          }
          .feature-icon {
            width: 24px;
            height: 24px;
            background: #7C3AED;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 12px;
            color: white;
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); 
            color: white !important; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            font-size: 16px;
            margin-top: 16px;
          }
          .button:hover {
            opacity: 0.9;
          }
          .footer { 
            text-align: center; 
            margin-top: 32px; 
            padding-top: 24px;
            border-top: 1px solid #eee;
            color: #999; 
            font-size: 13px; 
          }
          .social-links {
            margin: 16px 0;
          }
          .social-links a {
            color: #7C3AED;
            text-decoration: none;
            margin: 0 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">PL</div>
            <h1>${isSignup ? "Welcome to the Lab! 🚀" : "Welcome Back! 👋"}</h1>
            <p>Your journey to mastering development starts here</p>
          </div>
          <div class="content">
            <p class="greeting">Hi ${userName}! 👋</p>
            
            ${isSignup ? `
              <p class="message">
                Thank you for joining <strong>Pruthvi's Lab</strong>! We're thrilled to have you as part of our growing community of developers and learners.
              </p>
              
              <div class="features">
                <h3>🎯 What you can explore:</h3>
                <div class="feature-item">
                  <span class="feature-icon">📚</span>
                  <span>In-depth tutorials and learning resources</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">💻</span>
                  <span>Code snippets and examples</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🤖</span>
                  <span>AI-powered coding assistant</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🛠️</span>
                  <span>Curated AI tools directory</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">👥</span>
                  <span>Active developer community</span>
                </div>
              </div>
              
              <p class="message">
                Start exploring and level up your development skills today!
              </p>
            ` : `
              <p class="message">
                Great to see you back at <strong>Pruthvi's Lab</strong>! We hope you're ready to continue your learning journey.
              </p>
              
              <p class="message">
                Check out what's new since your last visit - new tutorials, code snippets, and AI tools are waiting for you!
              </p>
            `}
            
            <div style="text-align: center;">
              <a href="https://dev-api-learn.lovable.app/dashboard" class="button">
                ${isSignup ? "Start Exploring →" : "Continue Learning →"}
              </a>
            </div>
            
            <div class="footer">
              <p>Happy coding! 💜</p>
              <p><strong>The Pruthvi's Lab Team</strong></p>
              <div class="social-links">
                <a href="https://www.instagram.com/pruthvirajsinh__makwana/">Instagram</a> • 
                <a href="https://t.me/BAPU_EMPIRE">Telegram</a> • 
                <a href="https://pruthvirajsinh.in/">Website</a>
              </div>
              <p style="margin-top: 16px; font-size: 12px;">
                © ${new Date().getFullYear()} Dev API Learn | Pruthvi's Lab. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Pruthvi's Lab",
          email: "noreply@pruthvislab.com",
        },
        to: [{ email, name: userName }],
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo API error:", errorData);
      throw new Error(`Failed to send email: ${response.status}`);
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, messageId: result.messageId }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
