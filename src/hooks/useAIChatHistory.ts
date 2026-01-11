import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  image_url?: string | null;
  reaction?: "like" | "dislike" | null;
  created_at?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const useAIChatHistory = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("ai_chat_conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [user]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("ai_chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data?.map(m => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        image_url: m.image_url,
        reaction: m.reaction as "like" | "dislike" | null,
        created_at: m.created_at,
      })) || []);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Create new conversation
  const createConversation = useCallback(async (title?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("ai_chat_conversations")
        .insert({
          user_id: user.id,
          title: title || "New Chat",
        })
        .select()
        .single();

      if (error) throw error;
      
      setConversations(prev => [data, ...prev]);
      setCurrentConversationId(data.id);
      setMessages([]);
      return data.id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  }, [user]);

  // Save message
  const saveMessage = useCallback(async (
    conversationId: string,
    message: ChatMessage
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("ai_chat_messages")
        .insert({
          conversation_id: conversationId,
          role: message.role,
          content: message.content,
          image_url: message.image_url || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving message:", error);
      return null;
    }
  }, [user]);

  // Update message reaction
  const updateReaction = useCallback(async (
    messageId: string,
    reaction: "like" | "dislike" | null
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("ai_chat_messages")
        .update({ reaction })
        .eq("id", messageId);

      if (error) throw error;
      
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, reaction } : m
      ));
      
      toast({
        title: reaction ? "Feedback saved! 🙏" : "Feedback removed",
      });
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  }, [user, toast]);

  // Update conversation title
  const updateConversationTitle = useCallback(async (
    conversationId: string,
    title: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("ai_chat_conversations")
        .update({ title })
        .eq("id", conversationId);

      if (error) throw error;
      
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, title } : c
      ));
    } catch (error) {
      console.error("Error updating title:", error);
    }
  }, [user]);

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("ai_chat_conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;
      
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
      
      toast({ title: "Chat deleted! 🗑️" });
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  }, [user, currentConversationId, toast]);

  // Start new chat
  const startNewChat = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
  }, []);

  useEffect(() => {
    if (user) {
      fetchConversations();
    } else {
      setConversations([]);
      setMessages([]);
      setCurrentConversationId(null);
    }
  }, [user, fetchConversations]);

  return {
    conversations,
    currentConversationId,
    messages,
    setMessages,
    isLoading,
    fetchConversations,
    fetchMessages,
    createConversation,
    saveMessage,
    updateReaction,
    updateConversationTitle,
    deleteConversation,
    startNewChat,
  };
};
