
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        .eq('nome', 'default')
        .maybeSingle();

      if (data) {
        try {
          const eventos = data.observacoes ? JSON.parse(data.observacoes).eventos || {} : {};
          setConfig(prev => ({
            ...prev,
            prazo_maximo_dias: data.prazo_maximo_dias,
            taxa_padrao_juros: data.taxa_padrao_juros,
            tipo_juros_padrao: data.tipo_juros_padrao,
            taxa_juros_atraso: data.taxa_juros_atraso,
            taxa_multa_atraso: data.taxa_multa_atraso,
            eventos: eventos
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
      // Salvar configurações principais
      const { error: mainError } = await supabase
        .from('configuracoes_financeiras')
        .upsert({
          nome: 'default',
          prazo_maximo_dias: config.prazo_maximo_dias,
          taxa_padrao_juros: config.taxa_padrao_juros,
          tipo_juros_padrao: config.tipo_juros_padrao,
          taxa_juros_atraso: config.taxa_juros_atraso,
          taxa_multa_atraso: config.taxa_multa_atraso,
          observacoes: JSON.stringify({
            eventos: config.eventos
          }),
          created_by: user.id
        }, { onConflict: 'nome' });

      if (mainError) throw mainError;

      // Salvar configurações da Evolution API separadamente
      const { error: apiError } = await supabase
        .from('configuracoes_financeiras')
        .upsert({
          nome: 'evolution_api',
          prazo_maximo_dias: 0, // Default values for required fields
          taxa_padrao_juros: 0,
          tipo_juros_padrao: 'simples',
          taxa_juros_atraso: 0,
          taxa_multa_atraso: 0,
          observacoes: JSON.stringify({
            eventos: config.eventos
          }),
          created_by: user.id
        }, { onConflict: 'nome' });

      if (apiError) throw apiError;

      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    }
  };

  const handleFinancialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJurosTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig(prev => ({
      ...prev,
      tipo_juros_padrao: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações Financeiras" 
        description="Gerencie configurações padrão do sistema"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Juros e Prazos</CardTitle>
          <CardDescription>Defina os valores padrão para juros e prazos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prazo_maximo_dias">Prazo Máximo (dias)</Label>
              <Input 
                id="prazo_maximo_dias"
                name="prazo_maximo_dias"
                type="number"
                value={config.prazo_maximo_dias}
                onChange={handleFinancialInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxa_padrao_juros">Taxa Padrão de Juros (%)</Label>
              <Input 
                id="taxa_padrao_juros"
                name="taxa_padrao_juros"
                type="number"
                step="0.01"
                value={config.taxa_padrao_juros}
                onChange={handleFinancialInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo_juros_padrao">Tipo de Juros Padrão</Label>
              <select
                id="tipo_juros_padrao"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={config.tipo_juros_padrao}
                onChange={handleJurosTypeChange}
              >
                <option value="">Selecione...</option>
                <option value="simples">Simples</option>
                <option value="composto">Composto</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxa_juros_atraso">Taxa de Juros de Atraso (%)</Label>
              <Input 
                id="taxa_juros_atraso"
                name="taxa_juros_atraso"
                type="number"
                step="0.01"
                value={config.taxa_juros_atraso}
                onChange={handleFinancialInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxa_multa_atraso">Taxa de Multa de Atraso (%)</Label>
              <Input 
                id="taxa_multa_atraso"
                name="taxa_multa_atraso"
                type="number"
                step="0.01"
                value={config.taxa_multa_atraso}
                onChange={handleFinancialInputChange}
              />
            </div>
          </div>
          
          <Button onClick={handleSave} className="mt-4">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notificações e Eventos</CardTitle>
          <CardDescription>Configure os eventos que disparam notificações automáticas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
