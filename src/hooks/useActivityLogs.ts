
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

export const useActivityLogs = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Registrar uma atividade no log
  const logActivity = async (acao: string, detalhes?: any) => {
    if (!user) return { error: "Usuário não autenticado" };

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
