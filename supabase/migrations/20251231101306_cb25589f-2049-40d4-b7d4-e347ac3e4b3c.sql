-- Create user activity logs table
CREATE TABLE public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_action_type ON public.user_activity_logs(action_type);
CREATE INDEX idx_user_activity_logs_created_at ON public.user_activity_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all activity logs"
ON public.user_activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view their own activity logs"
ON public.user_activity_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs"
ON public.user_activity_logs
FOR INSERT
WITH CHECK (true);

-- Enable realtime for activity logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_activity_logs;