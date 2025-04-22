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
      clientes: {
        Row: {
          created_at: string | null
          documento: string
          email: string | null
          endereco: string
          id: string
          nome: string
          observacoes: string | null
          score: number | null
          telefone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          documento: string
          email?: string | null
          endereco: string
          id?: string
          nome: string
          observacoes?: string | null
          score?: number | null
          telefone: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          documento?: string
          email?: string | null
          endereco?: string
          id?: string
          nome?: string
          observacoes?: string | null
          score?: number | null
          telefone?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          categorias: Json
          contas_bancarias: Json
          created_at: string | null
          id: string
          juros_padrao: number
          metodos_pagamento: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          categorias?: Json
          contas_bancarias?: Json
          created_at?: string | null
          id?: string
          juros_padrao?: number
          metodos_pagamento?: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          categorias?: Json
          contas_bancarias?: Json
          created_at?: string | null
          id?: string
          juros_padrao?: number
          metodos_pagamento?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emprestimos: {
        Row: {
          cliente_id: string
          created_at: string | null
          data_emprestimo: string
          id: string
          juros_mensal: number
          num_parcelas: number
          status: string
          tipo_juros: string
          updated_at: string | null
          user_id: string
          valor_parcela: number
          valor_principal: number
        }
        Insert: {
          cliente_id: string
          created_at?: string | null
          data_emprestimo: string
          id?: string
          juros_mensal: number
          num_parcelas: number
          status?: string
          tipo_juros: string
          updated_at?: string | null
          user_id: string
          valor_parcela: number
          valor_principal: number
        }
        Update: {
          cliente_id?: string
          created_at?: string | null
          data_emprestimo?: string
          id?: string
          juros_mensal?: number
          num_parcelas?: number
          status?: string
          tipo_juros?: string
          updated_at?: string | null
          user_id?: string
          valor_parcela?: number
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
        ]
      }
      mensagens_agendadas: {
        Row: {
          cliente_id: string
          created_at: string | null
          data_envio: string
          emprestimo_id: string
          id: string
          status: string
          template_id: string
          user_id: string
        }
        Insert: {
          cliente_id: string
          created_at?: string | null
          data_envio: string
          emprestimo_id: string
          id?: string
          status?: string
          template_id: string
          user_id: string
        }
        Update: {
          cliente_id?: string
          created_at?: string | null
          data_envio?: string
          emprestimo_id?: string
          id?: string
          status?: string
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_agendadas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_agendadas_emprestimo_id_fkey"
            columns: ["emprestimo_id"]
            isOneToOne: false
            referencedRelation: "emprestimos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_agendadas_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates_mensagem"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          created_at: string | null
          data_pagamento: string
          emprestimo_id: string
          id: string
          metodo_pagamento: string
          observacoes: string | null
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_pagamento: string
          emprestimo_id: string
          id?: string
          metodo_pagamento: string
          observacoes?: string | null
          user_id: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data_pagamento?: string
          emprestimo_id?: string
          id?: string
          metodo_pagamento?: string
          observacoes?: string | null
          user_id?: string
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
      templates_mensagem: {
        Row: {
          conteudo: string
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
          user_id: string
          variaveis_utilizadas: string[]
        }
        Insert: {
          conteudo: string
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          user_id: string
          variaveis_utilizadas: string[]
        }
        Update: {
          conteudo?: string
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          user_id?: string
          variaveis_utilizadas?: string[]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
