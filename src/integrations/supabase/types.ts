export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      collection_products: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          product_id: string
          sort_order: number | null
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number | null
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          category: string
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          name: string
          product_count: number | null
          sort_order: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          name: string
          product_count?: number | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          name?: string
          product_count?: number | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          admin_response: string | null
          created_at: string
          customer_email: string
          customer_name: string
          id: string
          message: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          id?: string
          message: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          id?: string
          message?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cpt_payment_confirmations: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string | null
          payment_method: string
          reviewed_at: string | null
          reviewed_by: string | null
          screenshot_url: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_method: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          screenshot_url: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_method?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          screenshot_url?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cpt_payment_confirmations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          join_date: string
          last_order: string | null
          name: string
          phone: string | null
          status: string
          total_orders: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          join_date?: string
          last_order?: string | null
          name: string
          phone?: string | null
          status?: string
          total_orders?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          join_date?: string
          last_order?: string | null
          name?: string
          phone?: string | null
          status?: string
          total_orders?: number
          total_spent?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_history: {
        Row: {
          content: string
          created_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          recipient_email: string | null
          recipient_type: string
          sent_at: string | null
          status: string
          subject: string
          template_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email?: string | null
          recipient_type: string
          sent_at?: string | null
          status?: string
          subject: string
          template_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email?: string | null
          recipient_type?: string
          sent_at?: string | null
          status?: string
          subject?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_history_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          subject: string
          type: string
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          subject: string
          type: string
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          subject?: string
          type?: string
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      order_locations: {
        Row: {
          created_at: string
          id: string
          latitude: number | null
          location_name: string
          longitude: number | null
          notes: string | null
          order_id: string
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          latitude?: number | null
          location_name: string
          longitude?: number | null
          notes?: string | null
          order_id: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number | null
          location_name?: string
          longitude?: number | null
          notes?: string | null
          order_id?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_info: Json
          id: string
          items: Json
          order_number: string
          status: string | null
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_info: Json
          id?: string
          items?: Json
          order_number: string
          status?: string | null
          total: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_info?: Json
          id?: string
          items?: Json
          order_number?: string
          status?: string | null
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      password_failed_verification_attempts: {
        Row: {
          attempt_count: number
          created_at: string
          last_failed_at: string
          user_id: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          last_failed_at?: string
          user_id: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          last_failed_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_confirmations: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string
          payment_method: string
          payment_type: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          screenshot_url: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          payment_method: string
          payment_type?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          screenshot_url: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          payment_method?: string
          payment_type?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          screenshot_url?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string
          btc_address: string
          created_at: string
          id: string
          sort_code: string | null
          updated_at: string
          usdt_address: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_name: string
          btc_address: string
          created_at?: string
          id?: string
          sort_code?: string | null
          updated_at?: string
          usdt_address: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string
          btc_address?: string
          created_at?: string
          id?: string
          sort_code?: string | null
          updated_at?: string
          usdt_address?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          collection_id: string | null
          created_at: string
          description: string | null
          featured_order: number | null
          id: string
          image: string | null
          images: string[] | null
          is_featured: boolean | null
          is_most_picked: boolean | null
          most_picked_order: number | null
          name: string
          price: number
          ring_sizes: string[] | null
          specifications: Json | null
          stock: number | null
          updated_at: string
          watch_sizes: string[] | null
        }
        Insert: {
          category: string
          collection_id?: string | null
          created_at?: string
          description?: string | null
          featured_order?: number | null
          id?: string
          image?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          is_most_picked?: boolean | null
          most_picked_order?: number | null
          name: string
          price: number
          ring_sizes?: string[] | null
          specifications?: Json | null
          stock?: number | null
          updated_at?: string
          watch_sizes?: string[] | null
        }
        Update: {
          category?: string
          collection_id?: string | null
          created_at?: string
          description?: string | null
          featured_order?: number | null
          id?: string
          image?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          is_most_picked?: boolean | null
          most_picked_order?: number | null
          name?: string
          price?: number
          ring_sizes?: string[] | null
          specifications?: Json | null
          stock?: number | null
          updated_at?: string
          watch_sizes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email_notifications: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          newsletter: boolean | null
          phone: string | null
          profile_image_url: string | null
          sms_notifications: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          last_name?: string | null
          newsletter?: boolean | null
          phone?: string | null
          profile_image_url?: string | null
          sms_notifications?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          newsletter?: boolean | null
          phone?: string | null
          profile_image_url?: string | null
          sms_notifications?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      return_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          customer_email: string
          description: string | null
          id: string
          order_number: string
          priority: string
          reason: string
          return_label_sent: boolean | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          customer_email: string
          description?: string | null
          id?: string
          order_number: string
          priority?: string
          reason: string
          return_label_sent?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          customer_email?: string
          description?: string | null
          id?: string
          order_number?: string
          priority?: string
          reason?: string
          return_label_sent?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          admin_response: string | null
          created_at: string
          customer_email: string
          customer_name: string
          id: string
          message: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          id?: string
          message: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          id?: string
          message?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      warranty_claims: {
        Row: {
          admin_notes: string | null
          created_at: string
          customer_email: string
          customer_name: string | null
          customer_phone: string | null
          id: string
          issue_description: string
          order_number: string
          priority: string
          product_name: string
          purchase_date: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          customer_email: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          issue_description: string
          order_number: string
          priority?: string
          product_name: string
          purchase_date: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          issue_description?: string
          order_number?: string
          priority?: string
          product_name?: string
          purchase_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
