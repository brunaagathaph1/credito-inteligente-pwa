
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const configSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  taxa_padrao_juros: z.string().transform(val => parseFloat(val)),
  tipo_juros_padrao: z.string(),
  taxa_multa_atraso: z.string().transform(val => parseFloat(val)),
  taxa_juros_atraso: z.string().transform(val => parseFloat(val)),
  prazo_maximo_dias: z.string().transform(val => parseInt(val)),
  observacoes: z.string().optional(),
});

type ConfigFormValues = z.infer<typeof configSchema>;

const ConfiguracoesFinanceiras = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [configId, setConfigId] = useState<string | null>(null);
  
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      nome: "Configuração Padrão",
      taxa_padrao_juros: "2.5",
      tipo_juros_padrao: "composto",
      taxa_multa_atraso: "2.0",
      taxa_juros_atraso: "1.0",
      prazo_maximo_dias: "30",
      observacoes: ""
    }
  });
  
  useEffect(() => {
    const fetchConfig = async () => {
      if (!user) return;
      
      try {
        setIsFetching(true);
        const { data, error } = await supabase
          .from('configuracoes_financeiras')
          .select('*')
          .eq('created_by', user.id)
          .eq('ativo', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setConfigId(data.id);
          form.reset({
            nome: data.nome,
            taxa_padrao_juros: data.taxa_padrao_juros.toString(),
            tipo_juros_padrao: data.tipo_juros_padrao,
            taxa_multa_atraso: data.taxa_multa_atraso.toString(),
            taxa_juros_atraso: data.taxa_juros_atraso.toString(),
            prazo_maximo_dias: data.prazo_maximo_dias.toString(),
            observacoes: data.observacoes || ""
          });
        }
      } catch (error) {
        console.error("Erro ao buscar configurações financeiras:", error);
        toast.error("Erro ao carregar configurações financeiras");
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchConfig();
  }, [user, form]);
  
  const onSubmit = async (values: ConfigFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (configId) {
        // Update existing config
        const { error } = await supabase
          .from('configuracoes_financeiras')
          .update({
            nome: values.nome,
            taxa_padrao_juros: values.taxa_padrao_juros,
            tipo_juros_padrao: values.tipo_juros_padrao,
            taxa_multa_atraso: values.taxa_multa_atraso,
            taxa_juros_atraso: values.taxa_juros_atraso,
            prazo_maximo_dias: values.prazo_maximo_dias,
            observacoes: values.observacoes,
          })
          .eq('id', configId);
        
        if (error) throw error;
        
        toast.success("Configurações atualizadas com sucesso!");
      } else {
        // Create new config
        const { data, error } = await supabase
          .from('configuracoes_financeiras')
          .insert({
            nome: values.nome,
            taxa_padrao_juros: values.taxa_padrao_juros,
            tipo_juros_padrao: values.tipo_juros_padrao,
            taxa_multa_atraso: values.taxa_multa_atraso,
            taxa_juros_atraso: values.taxa_juros_atraso,
            prazo_maximo_dias: values.prazo_maximo_dias,
            observacoes: values.observacoes,
            created_by: user.id
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setConfigId(data.id);
        toast.success("Configurações criadas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações financeiras");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações Financeiras</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações financeiras padrão para empréstimos.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Empréstimos</CardTitle>
          <CardDescription>
            Configure os valores padrão para novos empréstimos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Configuração</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da configuração" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="taxa_padrao_juros"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taxa de Juros Padrão (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="2.5" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tipo_juros_padrao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Juros Padrão</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de juros" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="simples">Juros Simples</SelectItem>
                            <SelectItem value="composto">Juros Compostos</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="taxa_multa_atraso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taxa de Multa por Atraso (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="2.0" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taxa_juros_atraso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taxa de Juros por Atraso (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="1.0" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="prazo_maximo_dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo Máximo (dias)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="30" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Input placeholder="Observações sobre as configurações" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Configurações'
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracoesFinanceiras;
