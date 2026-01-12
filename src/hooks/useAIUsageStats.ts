import { useState, useEffect, useCallback } from "react";

export interface DailyStats {
  date: string;
  geminiCalls: number;
  lovableCalls: number;
  combinedCalls: number;
  totalCalls: number;
  imageGenerations: number;
}

export interface UsageStats {
  today: DailyStats;
  history: DailyStats[];
}

const STORAGE_KEY = "pruthviai_usage_stats";

const getToday = () => new Date().toISOString().split("T")[0];

const getEmptyDayStats = (date: string): DailyStats => ({
  date,
  geminiCalls: 0,
  lovableCalls: 0,
  combinedCalls: 0,
  totalCalls: 0,
  imageGenerations: 0,
});

export const useAIUsageStats = () => {
  const [stats, setStats] = useState<UsageStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UsageStats;
        // Check if today's date matches, otherwise reset today
        if (parsed.today.date !== getToday()) {
          return {
            today: getEmptyDayStats(getToday()),
            history: [...parsed.history, parsed.today].slice(-30), // Keep last 30 days
          };
        }
        return parsed;
      } catch {
        return { today: getEmptyDayStats(getToday()), history: [] };
      }
    }
    return { today: getEmptyDayStats(getToday()), history: [] };
  });

  // Persist to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  // Check and reset for new day
  useEffect(() => {
    const today = getToday();
    if (stats.today.date !== today) {
      setStats(prev => ({
        today: getEmptyDayStats(today),
        history: [...prev.history, prev.today].slice(-30),
      }));
    }
  }, [stats.today.date]);

  const recordCall = useCallback((apiUsed: "gemini" | "lovable" | "combined") => {
    setStats(prev => {
      const today = getToday();
      const currentToday = prev.today.date === today ? prev.today : getEmptyDayStats(today);
      
      return {
        ...prev,
        today: {
          ...currentToday,
          geminiCalls: currentToday.geminiCalls + (apiUsed === "gemini" || apiUsed === "combined" ? 1 : 0),
          lovableCalls: currentToday.lovableCalls + (apiUsed === "lovable" || apiUsed === "combined" ? 1 : 0),
          combinedCalls: currentToday.combinedCalls + (apiUsed === "combined" ? 1 : 0),
          totalCalls: currentToday.totalCalls + 1,
        },
      };
    });
  }, []);

  const recordImageGeneration = useCallback(() => {
    setStats(prev => {
      const today = getToday();
      const currentToday = prev.today.date === today ? prev.today : getEmptyDayStats(today);
      
      return {
        ...prev,
        today: {
          ...currentToday,
          imageGenerations: currentToday.imageGenerations + 1,
        },
      };
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats({
      today: getEmptyDayStats(getToday()),
      history: [],
    });
  }, []);

  return {
    stats,
    recordCall,
    recordImageGeneration,
    resetStats,
  };
};
