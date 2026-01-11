-- Create table for storing AI chat conversations
CREATE TABLE public.ai_chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing AI chat messages
CREATE TABLE public.ai_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.ai_chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  image_url TEXT,
  reaction TEXT CHECK (reaction IS NULL OR reaction IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
CREATE POLICY "Users can view their own conversations"
ON public.ai_chat_conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
ON public.ai_chat_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
ON public.ai_chat_conversations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
ON public.ai_chat_conversations FOR DELETE
USING (auth.uid() = user_id);

-- Policies for messages (via conversation ownership)
CREATE POLICY "Users can view their own messages"
ON public.ai_chat_messages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.ai_chat_conversations 
  WHERE id = conversation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create their own messages"
ON public.ai_chat_messages FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.ai_chat_conversations 
  WHERE id = conversation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can update their own messages"
ON public.ai_chat_messages FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.ai_chat_conversations 
  WHERE id = conversation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can delete their own messages"
ON public.ai_chat_messages FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.ai_chat_conversations 
  WHERE id = conversation_id AND user_id = auth.uid()
));

-- Trigger to update conversation's updated_at when messages are added
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ai_chat_conversations 
  SET updated_at = now() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON public.ai_chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_timestamp();