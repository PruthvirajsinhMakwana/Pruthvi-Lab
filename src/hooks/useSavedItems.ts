import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type ItemType = "blog" | "tutorial" | "code_snippet" | "api" | "resource";

interface SavedItem {
  id: string;
  item_type: ItemType;
  item_id: string;
  created_at: string;
}

export function useSavedItems(itemType?: ItemType) {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedItems = useCallback(async () => {
    if (!user) {
      setSavedItems([]);
      setLoading(false);
      return;
    }

    let query = supabase
      .from("saved_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (itemType) {
      query = query.eq("item_type", itemType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching saved items:", error);
    } else {
      setSavedItems((data || []) as SavedItem[]);
    }
    setLoading(false);
  }, [user, itemType]);

  useEffect(() => {
    fetchSavedItems();
  }, [fetchSavedItems]);

  const saveItem = async (itemId: string, type: ItemType) => {
    if (!user) {
      toast.error("Please sign in to save items");
      return false;
    }

    const { error } = await supabase.from("saved_items").insert({
      user_id: user.id,
      item_type: type,
      item_id: itemId,
    });

    if (error) {
      if (error.code === "23505") {
        toast.info("Item already saved");
      } else {
        console.error("Error saving item:", error);
        toast.error("Failed to save item");
      }
      return false;
    }

    toast.success("Item saved to your library");
    fetchSavedItems();
    return true;
  };

  const unsaveItem = async (itemId: string, type: ItemType) => {
    if (!user) return false;

    const { error } = await supabase
      .from("saved_items")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", type)
      .eq("item_id", itemId);

    if (error) {
      console.error("Error removing saved item:", error);
      toast.error("Failed to remove item");
      return false;
    }

    toast.success("Item removed from your library");
    fetchSavedItems();
    return true;
  };

  const isItemSaved = (itemId: string, type: ItemType) => {
    return savedItems.some(
      (item) => item.item_id === itemId && item.item_type === type
    );
  };

  return {
    savedItems,
    loading,
    saveItem,
    unsaveItem,
    isItemSaved,
    refetch: fetchSavedItems,
  };
}
