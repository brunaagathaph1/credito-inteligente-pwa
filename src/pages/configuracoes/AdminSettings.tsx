
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

interface AdminSettings {
  allow_user_registration: boolean;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AdminSettings>({
    allow_user_registration: true
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkAdminAndLoadSettings = async () => {
      if (!user) return;

      try {
        // Verificar se o usuário é admin
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
        const isAdminUser = profileData.role === 'admin';
        setIsAdmin(isAdminUser);

        if (!isAdminUser) {
          return;
        }

        // Carregar configurações
        const { data, error } = await supabase
          .from('system_settings')
          .select('*')
          .eq('name', 'admin_settings')
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setSettings(data.settings || {
            allow_user_registration: true
          });
        }
      } catch (error) {
        console.error("Error loading admin settings:", error);
        toast.error("Erro ao carregar configurações");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndLoadSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user || !isAdmin) return;
    
    setIsSaving(true);
    
    try {
      const { data: existingData, error: checkError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('name', 'admin_settings')
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingData) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('system_settings')
          .update({
            settings: settings,
            updated_by: user.id
          })
          .eq('id', existingData.id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('system_settings')
          .insert({
            name: 'admin_settings',
            settings: settings,
            created_by: user.id
          });
          
        if (insertError) throw insertError;
      }
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving admin settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Configurações de Administrador"
          description="Gerencie configurações administrativas do sistema"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">Carregando configurações...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Configurações de Administrador"
          description="Gerencie configurações administrativas do sistema"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 space-y-4">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">Acesso Restrito</h3>
              <p className="text-muted-foreground">
                Você não possui permissões de administrador para acessar esta página.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações de Administrador"
        description="Gerencie configurações administrativas do sistema"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Usuários</CardTitle>
          <CardDescription>Gerencie as configurações relacionadas a usuários do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Cadastro de Novos Usuários</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir que novos usuários se cadastrem no sistema
                </p>
              </div>
              <Switch
                checked={settings.allow_user_registration}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  allow_user_registration: checked
                }))}
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg flex gap-3 border">
              <UserPlus className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-muted-foreground">
                  {settings.allow_user_registration ? (
                    "Novos usuários podem se cadastrar livremente através da página de registro."
                  ) : (
                    "O cadastro de novos usuários está desativado. Apenas administradores podem criar contas."
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="mt-4"
          >
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
