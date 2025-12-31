import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type ActivityType = 
  | 'login'
  | 'logout'
  | 'signup'
  | 'profile_update'
  | 'password_reset'
  | 'content_create'
  | 'content_update'
  | 'content_delete'
  | 'purchase'
  | 'comment'
  | 'message';

interface LogActivityParams {
  userId: string;
  actionType: ActivityType;
  details?: Json;
}

export const logActivity = async ({ userId, actionType, details = {} }: LogActivityParams) => {
  try {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
    
    const { error } = await supabase
      .from('user_activity_logs')
      .insert([{
        user_id: userId,
        action_type: actionType,
        details,
        user_agent: userAgent,
      }]);

    if (error) {
      console.error('Failed to log activity:', error);
    }
  } catch (err) {
    console.error('Activity logging error:', err);
  }
};

export const useActivityLog = () => {
  return { logActivity };
};
