export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cpf: string | null
          created_at: string
          created_by: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          score: number | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          score?: number | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          score?: number | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes_financeiras: {
        Row: {
          ativo: boolean
          created_at: string
          created_by: string
          id: string
          nome: string
          observacoes: string | null
          prazo_maximo_dias: number
          taxa_juros_atraso: number
          taxa_multa_atraso: number
          taxa_padrao_juros: number
          tipo_juros_padrao: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          created_by: string
          id?: string
          nome: string
          observacoes?: string | null
          prazo_maximo_dias: number
          taxa_juros_atraso: number
          taxa_multa_atraso: number
          taxa_padrao_juros: number
          tipo_juros_padrao: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          created_by?: string
          id?: string
          nome?: string
          observacoes?: string | null
          prazo_maximo_dias?: number
          taxa_juros_atraso?: number
          taxa_multa_atraso?: number
          taxa_padrao_juros?: number
          tipo_juros_padrao?: string
          updated_at?: string
        }
        Relationships: []
      }
      contas_bancarias: {
        Row: {
          atualizada_em: string
          banco: string
          cpf_cnpj: string | null
          criada_em: string
          criada_por: string
          id: string
          nome: string
          numero_agencia: string
          numero_conta: string
          observacoes: string | null
          status: string
          tipo: string
          titular: string | null
        }
        Insert: {
          atualizada_em?: string
          banco: string
          cpf_cnpj?: string | null
          criada_em?: string
          criada_por: string
          id?: string
          nome: string
          numero_agencia: string
          numero_conta: string
          observacoes?: string | null
          status?: string
          tipo: string
          titular?: string | null
        }
        Update: {
          atualizada_em?: string
          banco?: string
          cpf_cnpj?: string | null
          criada_em?: string
          criada_por?: string
          id?: string
          nome?: string
          numero_agencia?: string
          numero_conta?: string
          observacoes?: string | null
          status?: string
          tipo?: string
          titular?: string | null
        }
        Relationships: []
      }
      emprestimos: {
        Row: {
          cliente_id: string
          created_at: string
          created_by: string
          data_emprestimo: string
          data_vencimento: string
          id: string
          observacoes: string | null
          renegociacao_id: string | null
          renegociado: boolean | null
          status: string
          taxa_juros: number
          tipo_juros: string
          updated_at: string
          valor_principal: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          created_by: string
          data_emprestimo?: string
          data_vencimento: string
          id?: string
          observacoes?: string | null
          renegociacao_id?: string | null
          renegociado?: boolean | null
          status?: string
          taxa_juros: number
          tipo_juros: string
          updated_at?: string
          valor_principal: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          created_by?: string
          data_emprestimo?: string
          data_vencimento?: string
          id?: string
          observacoes?: string | null
          renegociacao_id?: string | null
          renegociado?: boolean | null
          status?: string
          taxa_juros?: number
          tipo_juros?: string
          updated_at?: string
          valor_principal?: number
        }
        Relationships: [
          {
            foreignKeyName: "emprestimos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emprestimos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "telefones_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emprestimos_renegociacao_id_fkey"
            columns: ["renegociacao_id"]
            isOneToOne: false
            referencedRelation: "renegociacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_atividades: {
        Row: {
          acao: string
          data_hora: string
          detalhes: Json | null
          id: string
          ip_origem: string | null
          user_agent: string | null
          usuario_id: string
        }
        Insert: {
          acao: string
          data_hora?: string
          detalhes?: Json | null
          id?: string
          ip_origem?: string | null
          user_agent?: string | null
          usuario_id: string
        }
        Update: {
          acao?: string
          data_hora?: string
          detalhes?: Json | null
          id?: string
          ip_origem?: string | null
          user_agent?: string | null
          usuario_id?: string
        }
        Relationships: []
      }
      mensagens: {
        Row: {
          assunto: string
          cliente_id: string
          conteudo: string
          created_at: string
          created_by: string
          data_agendamento: string | null
          data_envio: string | null
          emprestimo_id: string | null
          erro: string | null
          id: string
          status: string
          template_id: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          assunto: string
          cliente_id: string
          conteudo: string
          created_at?: string
          created_by: string
          data_agendamento?: string | null
          data_envio?: string | null
          emprestimo_id?: string | null
          erro?: string | null
          id?: string
          status: string
          template_id?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          assunto?: string
          cliente_id?: string
          conteudo?: string
          created_at?: string
          created_by?: string
          data_agendamento?: string | null
          data_envio?: string | null
          emprestimo_id?: string | null
          erro?: string | null
          id?: string
          status?: string
          template_id?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "telefones_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_emprestimo_id_fkey"
            columns: ["emprestimo_id"]
            isOneToOne: false
            referencedRelation: "emprestimos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates_mensagens"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          created_at: string
          created_by: string
          data_pagamento: string
          emprestimo_id: string
          id: string
          observacoes: string | null
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          created_by: string
          data_pagamento?: string
          emprestimo_id: string
          id?: string
          observacoes?: string | null
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          created_at?: string
          created_by?: string
          data_pagamento?: string
          emprestimo_id?: string
          id?: string
          observacoes?: string | null
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_emprestimo_id_fkey"
            columns: ["emprestimo_id"]
            isOneToOne: false
            referencedRelation: "emprestimos"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      renegociacoes: {
        Row: {
          created_at: string
          created_by: string
          data_renegociacao: string
          emprestimo_anterior_juros: number
          emprestimo_anterior_valor: number
          emprestimo_anterior_vencimento: string
          emprestimo_id: string
          id: string
          motivo: string | null
          nova_data_vencimento: string
          nova_taxa_juros: number
          novo_tipo_juros: string
          novo_valor_principal: number
          observacoes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          data_renegociacao?: string
          emprestimo_anterior_juros: number
          emprestimo_anterior_valor: number
          emprestimo_anterior_vencimento: string
          emprestimo_id: string
          id?: string
          motivo?: string | null
          nova_data_vencimento: string
          nova_taxa_juros: number
          novo_tipo_juros: string
          novo_valor_principal: number
          observacoes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          data_renegociacao?: string
          emprestimo_anterior_juros?: number
          emprestimo_anterior_valor?: number
          emprestimo_anterior_vencimento?: string
          emprestimo_id?: string
          id?: string
          motivo?: string | null
          nova_data_vencimento?: string
          nova_taxa_juros?: number
          novo_tipo_juros?: string
          novo_valor_principal?: number
          observacoes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renegociacoes_emprestimo_id_fkey"
            columns: ["emprestimo_id"]
            isOneToOne: false
            referencedRelation: "emprestimos"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_mensagens: {
        Row: {
          assunto: string
          ativo: boolean
          conteudo: string
          created_at: string
          created_by: string
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          assunto: string
          ativo?: boolean
          conteudo: string
          created_at?: string
          created_by: string
          id?: string
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          assunto?: string
          ativo?: boolean
          conteudo?: string
          created_at?: string
          created_by?: string
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          erro: string | null
          evento: string
          id: string
          payload: Json
          resposta: Json | null
          status: string
          webhook_id: string
        }
        Insert: {
          created_at?: string
          erro?: string | null
          evento: string
          id?: string
          payload: Json
          resposta?: Json | null
          status: string
          webhook_id: string
        }
        Update: {
          created_at?: string
          erro?: string | null
          evento?: string
          id?: string
          payload?: Json
          resposta?: Json | null
          status?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          ativo: boolean
          created_at: string
          created_by: string
          eventos: string[]
          headers: Json | null
          id: string
          nome: string
          secret_key: string | null
          updated_at: string
          url: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          created_by: string
          eventos: string[]
          headers?: Json | null
          id?: string
          nome: string
          secret_key?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          created_by?: string
          eventos?: string[]
          headers?: Json | null
          id?: string
          nome?: string
          secret_key?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      telefones_clientes: {
        Row: {
          id: string | null
          telefone: string | null
        }
        Insert: {
          id?: string | null
          telefone?: string | null
        }
        Update: {
          id?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
