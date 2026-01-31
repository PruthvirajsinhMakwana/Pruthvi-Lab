import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  type: "login" | "signup" | "contact" | "support" | "visitor";
  userName?: string;
  userEmail?: string;
  message?: string;
  subject?: string;
  phone?: string;
  details?: Record<string, any>;
}

const getEmoji = (type: string): string => {
  switch (type) {
    case "login": return "🔐";
    case "signup": return "🎉";
    case "contact": return "📧";
    case "support": return "🆘";
    case "visitor": return "👀";
    default: return "📢";
  }
};

const getTitle = (type: string): string => {
  switch (type) {
    case "login": return "User Login";
    case "signup": return "New User Signup!";
    case "contact": return "Contact Form Submission";
    case "support": return "Support Request";
    case "visitor": return "New Visitor";
    default: return "Notification";
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userName, userEmail, message, subject, phone, details }: NotifyRequest = await req.json();

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!botToken || !chatId) {
      console.error("Telegram credentials not configured");
      return new Response(JSON.stringify({ error: "Telegram not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emoji = getEmoji(type);
    const title = getTitle(type);
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    let messageText = `${emoji} *${title}*\n\n`;
    messageText += `⏰ *Time:* ${timestamp}\n`;

    if (userName) messageText += `👤 *Name:* ${userName}\n`;
    if (userEmail) messageText += `📧 *Email:* ${userEmail}\n`;
    if (phone) messageText += `📱 *Phone:* ${phone}\n`;
    if (subject) messageText += `📝 *Subject:* ${subject}\n`;
    if (message) messageText += `\n💬 *Message:*\n${message}\n`;

    if (details) {
      messageText += `\n📊 *Details:*\n`;
      for (const [key, value] of Object.entries(details)) {
        messageText += `• ${key}: ${value}\n`;
      }
    }

    if (type === "signup") {
      messageText += `\n✅ New user has joined Dev API Learn!`;
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.text();
      console.error("Telegram API error:", errorData);
      throw new Error("Failed to send Telegram notification");
    }

    console.log(`Telegram ${type} notification sent successfully`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-telegram-activity:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
