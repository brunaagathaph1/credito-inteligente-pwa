import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { SystemSettings } from '@/types/mensagens';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Settings, Users, Shield, Database, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyState } from '@/components/common/EmptyState';

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [systemSettings, setSystemSettings] = useState<SystemSettings[]>([]);

  // Fetch system settings
  const fetchSystemSettings = async () => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');

    if (error) throw error;
    return data as SystemSettings[];
  };

  const { data: settings, isLoading } = useQuery<SystemSettings[]>({
    queryKey: ['system_settings'],
    queryFn: fetchSystemSettings
  });

  // Mutation to update system settings
  const updateSystemSetting = useMutation({
    mutationFn: async (setting: Partial<SystemSettings>) => {
      const { data, error } = await supabase
        .from('system_settings')
        .update(setting)
        .eq('id', setting.id)
        .select()
        .single();

      if (error) throw error;
      return data as SystemSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_settings'] });
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar configurações: ${error.message}`);
    }
  });

  // Mutation to create system settings
  const createSystemSetting = useMutation({
    mutationFn: async (setting: Omit<SystemSettings, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('system_settings')
        .insert(setting)
        .select()
        .single();

      if (error) throw error;
      return data as SystemSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_settings'] });
      toast.success('Configuração criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar configuração: ${error.message}`);
    }
  });

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Configurações Administrativas"
          description="Gerenciamento de configurações do sistema"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Restrito</AlertTitle>
          <AlertDescription>
            Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar configurações do sistema.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações Administrativas"
        description="Gerenciamento de configurações do sistema"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Database className="mr-2 h-4 w-4" />
            Integrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configurações básicas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div>Carregando configurações...</div>
              ) : settings && settings.length > 0 ? (
                <div className="space-y-4">
                  {settings
                    .filter(setting => setting.name.startsWith('general.'))
                    .map(setting => (
                      <div key={setting.id} className="grid grid-cols-2 gap-4 items-center">
                        <Label htmlFor={setting.id}>{setting.name.replace('general.', '')}</Label>
                        <Input
                          id={setting.id}
                          value={setting.settings.value || ''}
                          onChange={(e) => {
                            updateSystemSetting.mutate({
                              id: setting.id,
                              settings: { ...setting.settings, value: e.target.value },
                              updated_by: user?.id
                            });
                          }}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyState
                  title="Nenhuma configuração encontrada"
                  description="Adicione configurações gerais para o sistema"
                  icon={<Settings />}
                  action={
                    <Button
                      onClick={() => {
                        if (user) {
                          createSystemSetting.mutate({
                            name: 'general.app_name',
                            settings: { value: 'Meu Sistema' },
                            created_by: user.id
                          });
                        }
                      }}
                    >
                      Adicionar Configuração Padrão
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Configurações relacionadas aos usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Permitir novos registros</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilitar registro de novos usuários no sistema
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={() => {
                      toast.info("Funcionalidade em desenvolvimento");
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Aprovação manual</Label>
                    <p className="text-sm text-muted-foreground">
                      Exigir aprovação manual para novos usuários
                    </p>
                  </div>
                  <Switch
                    checked={false}
                    onCheckedChange={() => {
                      toast.info("Funcionalidade em desenvolvimento");
                    }}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => {
                      toast.info("Funcionalidade em desenvolvimento");
                    }}
                  >
                    Gerenciar Usuários
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Configurações relacionadas à segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Autenticação de dois fatores</Label>
                    <p className="text-sm text-muted-foreground">
                      Exigir autenticação de dois fatores para todos os usuários
                    </p>
                  </div>
                  <Switch
                    checked={false}
                    onCheckedChange={() => {
                      toast.info("Funcionalidade em desenvolvimento");
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Tempo de expiração da sessão</Label>
                    <p className="text-sm text-muted-foreground">
                      Tempo em minutos até a sessão expirar
                    </p>
                  </div>
                  <Select defaultValue="60">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o tempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="240">4 horas</SelectItem>
                      <SelectItem value="480">8 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => {
                      toast.info("Funcionalidade em desenvolvimento");
                    }}
                  >
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Configurações de integrações com serviços externos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">SMTP (E-mail)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">Servidor SMTP</Label>
                      <Input id="smtp-host" placeholder="smtp.example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Porta</Label>
                      <Input id="smtp-port" placeholder="587" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-user">Usuário</Label>
                      <Input id="smtp-user" placeholder="user@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Senha</Label>
                      <Input id="smtp-password" type="password" placeholder="********" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="smtp-from">E-mail de Origem</Label>
                      <Input id="smtp-from" placeholder="noreply@example.com" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      onClick={() => {
                        toast.info("Funcionalidade em desenvolvimento");
                      }}
                    >
                      Salvar Configurações SMTP
                    </Button>
                    <Button variant="outline"
                      onClick={() => {
                        toast.info("Funcionalidade em desenvolvimento");
                      }}
                    >
                      Testar Conexão
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">API WhatsApp</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-url">URL da API</Label>
                      <Input id="whatsapp-url" placeholder="https://api.example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-token">Token de Acesso</Label>
                      <Input id="whatsapp-token" type="password" placeholder="********" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      onClick={() => {
                        toast.info("Funcionalidade em desenvolvimento");
                      }}
                    >
                      Salvar Configurações WhatsApp
                    </Button>
                    <Button variant="outline"
                      onClick={() => {
                        toast.info("Funcionalidade em desenvolvimento");
                      }}
                    >
                      Testar Conexão
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
