-- Add phone_number column to profiles table for marketing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Create email_templates table for storing preset templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email_campaigns table for tracking sent campaigns
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.email_templates(id),
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  recipients_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create marketing_subscribers table for storing subscriber data
CREATE TABLE IF NOT EXISTS public.marketing_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone_number TEXT,
  source TEXT DEFAULT 'signup',
  subscribed BOOLEAN DEFAULT true,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_subscribers ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for email_templates
CREATE POLICY "Admin can read email templates" ON public.email_templates
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can insert email templates" ON public.email_templates
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update email templates" ON public.email_templates
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete email templates" ON public.email_templates
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Admin-only policies for email_campaigns
CREATE POLICY "Admin can read email campaigns" ON public.email_campaigns
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can insert email campaigns" ON public.email_campaigns
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update email campaigns" ON public.email_campaigns
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Admin-only policies for marketing_subscribers
CREATE POLICY "Admin can read marketing subscribers" ON public.marketing_subscribers
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update marketing subscribers" ON public.marketing_subscribers
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Allow anyone to subscribe (for public subscribe forms)
CREATE POLICY "Anyone can subscribe" ON public.marketing_subscribers
  FOR INSERT WITH CHECK (true);

-- Insert preset email templates
INSERT INTO public.email_templates (name, subject, html_content, category) VALUES
('New Tutorial Published', '🚀 New Tutorial Alert: {{tutorial_title}}', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<h1 style="color: #6366f1;">New Tutorial Just Dropped! 🎉</h1>
<p>Hey {{name}},</p>
<p>We just published a brand new tutorial that you''re going to love:</p>
<div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 20px; border-radius: 10px; color: white; margin: 20px 0;">
<h2 style="margin: 0;">{{tutorial_title}}</h2>
<p style="margin: 10px 0 0 0; opacity: 0.9;">{{tutorial_description}}</p>
</div>
<a href="{{tutorial_link}}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Check it out →</a>
<p style="color: #666; margin-top: 30px;">Happy coding! 💻<br>Team Pruthvi''s Lab</p>
</div>', 'tutorial'),

('Weekly Newsletter', '📚 This Week at Pruthvi''s Lab', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<h1 style="color: #6366f1;">Weekly Digest 📰</h1>
<p>Hey {{name}},</p>
<p>Here''s what happened this week at Pruthvi''s Lab:</p>
<h3>🆕 New Tutorials</h3>
<p>{{new_tutorials}}</p>
<h3>🔥 Popular Snippets</h3>
<p>{{popular_snippets}}</p>
<h3>💬 Community Highlights</h3>
<p>{{community_updates}}</p>
<a href="https://pruthvislab.com" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Visit Pruthvi''s Lab →</a>
<p style="color: #666; margin-top: 30px;">Keep learning, keep growing! 🚀<br>Team Pruthvi''s Lab</p>
</div>', 'newsletter'),

('Welcome Email', '🎉 Welcome to Pruthvi''s Lab!', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<h1 style="color: #6366f1;">Welcome aboard! 🚀</h1>
<p>Hey {{name}},</p>
<p>Thanks for joining Pruthvi''s Lab! You''re now part of a community of {{total_users}}+ developers leveling up their skills.</p>
<h3>What''s waiting for you:</h3>
<ul>
<li>📚 {{tutorial_count}}+ Tutorials</li>
<li>💻 {{snippet_count}}+ Code Snippets</li>
<li>🤖 AI-Powered Coding Assistant</li>
<li>👥 Active Developer Community</li>
</ul>
<a href="https://pruthvislab.com/tutorials" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Start Learning →</a>
<p style="color: #666; margin-top: 30px;">Happy coding! 💻<br>Team Pruthvi''s Lab</p>
</div>', 'welcome'),

('Special Offer', '🔥 Exclusive Offer Just For You!', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<h1 style="color: #6366f1;">Special Offer! 🎁</h1>
<p>Hey {{name}},</p>
<p>We have an exclusive offer just for you!</p>
<div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 25px; border-radius: 10px; color: white; margin: 20px 0; text-align: center;">
<h2 style="margin: 0; font-size: 28px;">{{offer_title}}</h2>
<p style="margin: 10px 0; font-size: 18px;">{{offer_description}}</p>
<p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;">Valid until: {{expiry_date}}</p>
</div>
<a href="{{offer_link}}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Claim Offer →</a>
<p style="color: #666; margin-top: 30px;">Don''t miss out! 🚀<br>Team Pruthvi''s Lab</p>
</div>', 'promotional');

-- Create function to auto-add subscribers on user signup
CREATE OR REPLACE FUNCTION public.add_marketing_subscriber()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.marketing_subscribers (email, full_name, user_id, source)
  VALUES (
    NEW.email,
    NEW.full_name,
    NEW.id,
    'signup'
  )
  ON CONFLICT (email) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    full_name = COALESCE(EXCLUDED.full_name, marketing_subscribers.full_name),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to add subscriber when profile is created/updated
DROP TRIGGER IF EXISTS on_profile_add_subscriber ON public.profiles;
CREATE TRIGGER on_profile_add_subscriber
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.add_marketing_subscriber();