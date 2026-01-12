import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkEmailRequest {
  templateId?: string;
  subject: string;
  htmlContent: string;
  campaignId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!BREVO_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { subject, htmlContent, campaignId }: BulkEmailRequest = await req.json();

    // Fetch all subscribed marketing subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from("marketing_subscribers")
      .select("email, full_name")
      .eq("subscribed", true);

    if (fetchError) {
      throw new Error(`Failed to fetch subscribers: ${fetchError.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: "No subscribers found" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Sending bulk email to ${subscribers.length} subscribers`);

    let successCount = 0;
    let failCount = 0;

    // Send emails in batches of 50 to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const promises = batch.map(async (subscriber) => {
        try {
          // Replace template variables
          let personalizedContent = htmlContent
            .replace(/{{name}}/g, subscriber.full_name || "Developer")
            .replace(/{{email}}/g, subscriber.email);

          const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "api-key": BREVO_API_KEY,
            },
            body: JSON.stringify({
              sender: {
                name: "Pruthvi's Lab",
                email: "noreply@pruthvislab.com",
              },
              to: [{ email: subscriber.email, name: subscriber.full_name || undefined }],
              subject,
              htmlContent: personalizedContent,
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
            const errorData = await response.json();
            console.error(`Failed to send to ${subscriber.email}:`, errorData);
          }
        } catch (error) {
          failCount++;
          console.error(`Error sending to ${subscriber.email}:`, error);
        }
      });

      await Promise.all(promises);
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update campaign status if campaignId provided
    if (campaignId) {
      await supabase
        .from("email_campaigns")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          recipients_count: successCount,
        })
        .eq("id", campaignId);
    }

    console.log(`Bulk email complete: ${successCount} sent, ${failCount} failed`);

    return new Response(JSON.stringify({ 
      success: true, 
      sent: successCount, 
      failed: failCount,
      total: subscribers.length 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-bulk-brevo-email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
