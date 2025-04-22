import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ConfiguracoesFinanceiras = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState({
    prazo_maximo_dias: 0,
    taxa_padrao_juros: 0,
    tipo_juros_padrao: '',
    taxa_juros_atraso: 0,
    taxa_multa_atraso: 0,
    observacoes: '',
    eventos: {
      novoEmprestimo: false,
      novoPagamento: false,
      novoCliente: false,
      emprestimoAtrasado: false
    }
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from('configuracoes_financeiras')
        .select('*')
        .eq('nome', 'evolution_api')
        .maybeSingle();

      if (data) {
        try {
          const parsedConfig = JSON.parse(data.observacoes || '{}');
          setConfig(prev => ({
            ...prev,
            ...parsedConfig,
            prazo_maximo_dias: data.prazo_maximo_dias,
            taxa_padrao_juros: data.taxa_padrao_juros,
            tipo_juros_padrao: data.tipo_juros_padrao,
            taxa_juros_atraso: data.taxa_juros_atraso,
            taxa_multa_atraso: data.taxa_multa_atraso
          }));
        } catch(e) {
          console.error("Error parsing configuration:", e);
        }
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('configuracoes_financeiras')
        .upsert({
          nome: 'evolution_api',
          observacoes: JSON.stringify({
            eventos: config.eventos
          }),
          prazo_maximo_dias: config.prazo_maximo_dias,
          taxa_padrao_juros: config.taxa_padrao_juros,
          tipo_juros_padrao: config.tipo_juros_padrao,
          taxa_juros_atraso: config.taxa_juros_atraso,
          taxa_multa_atraso: config.taxa_multa_atraso,
          created_by: user.id
        }, { onConflict: 'nome' });

      if (error) throw error;
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações Financeiras" 
        description="Gerencie configurações padrão do sistema"
      />
      <Card>
        <CardHeader>
          <CardTitle>Eventos da API Evolution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="novoEmprestimo"
                checked={config.eventos.novoEmprestimo}
                onCheckedChange={(checked) => setConfig(prev => ({
                  ...prev,
                  eventos: { ...prev.eventos, novoEmprestimo: !!checked }
                }))}
              />
              <Label htmlFor="novoEmprestimo">Novo Empréstimo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="novoPagamento"
                checked={config.eventos.novoPagamento}
                onCheckedChange={(checked) => setConfig(prev => ({
                  ...prev,
                  eventos: { ...prev.eventos, novoPagamento: !!checked }
                }))}
              />
              <Label htmlFor="novoPagamento">Novo Pagamento</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="novoCliente"
                checked={config.eventos.novoCliente}
                onCheckedChange={(checked) => setConfig(prev => ({
                  ...prev,
                  eventos: { ...prev.eventos, novoCliente: !!checked }
                }))}
              />
              <Label htmlFor="novoCliente">Novo Cliente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emprestimoAtrasado"
                checked={config.eventos.emprestimoAtrasado}
                onCheckedChange={(checked) => setConfig(prev => ({
                  ...prev,
                  eventos: { ...prev.eventos, emprestimoAtrasado: !!checked }
                }))}
              />
              <Label htmlFor="emprestimoAtrasado">Empréstimo Atrasado</Label>
            </div>
          </div>
          <Button onClick={handleSave} className="mt-4">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default ConfiguracoesFinanceiras;
