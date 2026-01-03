import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

interface OTPRequest {
  action: "send" | "verify";
  email: string;
  otp?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, email, otp }: OTPRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify user is admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role, user_id")
      .eq("user_id", (await supabase.from("profiles").select("id").eq("email", email).single()).data?.id)
      .single();

    if (!roles || (roles.role !== "admin" && roles.role !== "super_admin")) {
      return new Response(
        JSON.stringify({ error: "Not an admin account" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "send") {
      if (!BREVO_API_KEY) {
        throw new Error("Email service not configured");
      }

      const generatedOTP = generateOTP();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

      // Store OTP
      otpStore.set(email.toLowerCase(), { otp: generatedOTP, expiresAt });

      console.log(`Sending OTP to admin: ${email}`);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 500px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 40px 30px; text-align: center; }
            .otp-box { background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 20px 40px; border-radius: 12px; display: inline-block; margin: 20px 0; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; color: #92400e; font-size: 14px; }
            .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Admin 2FA Verification</h1>
            </div>
            <div class="content">
              <p style="color: #666; font-size: 16px;">Your one-time verification code is:</p>
              <div class="otp-box">${generatedOTP}</div>
              <p style="color: #888; font-size: 14px;">This code expires in <strong>5 minutes</strong></p>
              <div class="warning">
                ⚠️ Never share this code with anyone. Pruthvi's Lab staff will never ask for it.
              </div>
            </div>
            <div class="footer">
              <p>This is an automated security email from Pruthvi's Lab Admin Panel</p>
              <p>© ${new Date().getFullYear()} Pruthvi's Lab. All rights reserved.</p>
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
          sender: { name: "Pruthvi's Lab Security", email: "security@pruthvislab.com" },
          to: [{ email }],
          subject: `🔐 Your Admin Login Code: ${generatedOTP}`,
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Brevo error:", errorData);
        throw new Error("Failed to send OTP email");
      }

      console.log("OTP sent successfully to:", email);

      return new Response(
        JSON.stringify({ success: true, message: "OTP sent successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } 
    
    if (action === "verify") {
      if (!otp) {
        throw new Error("OTP is required for verification");
      }

      const stored = otpStore.get(email.toLowerCase());

      if (!stored) {
        return new Response(
          JSON.stringify({ success: false, error: "No OTP found. Please request a new one." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(email.toLowerCase());
        return new Response(
          JSON.stringify({ success: false, error: "OTP expired. Please request a new one." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (stored.otp !== otp) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid OTP. Please try again." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // OTP verified, remove it
      otpStore.delete(email.toLowerCase());

      // Log successful 2FA verification
      await supabase.from("user_activity_logs").insert({
        user_id: roles.user_id,
        action_type: "admin_2fa_verified",
        details: { email },
        ip_address: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip"),
        user_agent: req.headers.get("user-agent"),
      });

      console.log("OTP verified for:", email);

      return new Response(
        JSON.stringify({ success: true, verified: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    throw new Error("Invalid action");
  } catch (error: any) {
    console.error("Error in send-admin-otp:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
