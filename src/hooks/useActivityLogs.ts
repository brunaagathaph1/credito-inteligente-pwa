import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type ActivityLog = {
  id: string;
  usuario_id: string;
  acao: string;
  detalhes?: any;
  ip_origem?: string;
  user_agent?: string;
  data_hora: string;
};

// Keep track of recent actions to prevent duplicates
const recentActions = new Map<string, number>();
const DUPLICATE_TIMEOUT = 3000; // 3 seconds

export const useActivityLogs = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Registrar uma atividade no log
  const logActivity = async (acao: string, detalhes?: any) => {
    if (!user) return { error: "Usuário não autenticado" };

    // Create a key from action and details to track duplicates
    const actionKey = `${acao}-${JSON.stringify(detalhes || {})}-${user.id}`;
    const now = Date.now();
    
    // Check if this is a duplicate action within the timeout period
    if (recentActions.has(actionKey)) {
      const lastLogTime = recentActions.get(actionKey) || 0;
      if (now - lastLogTime < DUPLICATE_TIMEOUT) {
        console.log("Ação duplicada ignorada:", acao);
        return { success: true, duplicateIgnored: true };
      }
    }
    
    // Update the timestamp for this action
    recentActions.set(actionKey, now);
    
    // Clean up old entries from the map (optional)
    for (const [key, timestamp] of recentActions.entries()) {
      if (now - timestamp > DUPLICATE_TIMEOUT) {
        recentActions.delete(key);
      }
    }

    try {
      // Get the real IP and user agent
      const activityLog = {
        usuario_id: user.id,
        acao,
        detalhes,
        ip_origem: window.location.hostname,
        user_agent: navigator.userAgent
      };

      const { error } = await supabase.from("logs_atividades").insert(activityLog);
      
      if (error) {
        console.error("Erro ao registrar atividade:", error);
        return { error };
      }
      
      console.log("Atividade registrada com sucesso:", acao);
      return { success: true };
    } catch (error) {
      console.error("Erro ao registrar atividade:", error);
      return { error };
    }
  };

  // Buscar logs de atividade do usuário
  const fetchUserLogs = async (limit = 50) => {
    if (!user) return { error: "Usuário não autenticado" };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("logs_atividades")
        .select("*")
        .eq("usuario_id", user.id)
        .order("data_hora", { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      setLogs(data || []);
      return { data };
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    loading,
    logActivity,
    fetchUserLogs
  };
};
