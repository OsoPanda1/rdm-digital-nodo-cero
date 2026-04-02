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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string
          data: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      businesses: {
        Row: {
          address: string | null
          category: string
          created_at: string
          description: string
          email: string | null
          facebook: string | null
          id: string
          image_url: string | null
          image_url_2: string | null
          image_url_3: string | null
          instagram: string | null
          is_featured: boolean
          is_premium: boolean
          is_verified: boolean
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string | null
          phone: string | null
          price_range: string | null
          rating: number | null
          schedule_display: string | null
          short_description: string | null
          status: string
          tiktok: string | null
          updated_at: string
          video_url: string | null
          views_count: number
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          category?: string
          created_at?: string
          description?: string
          email?: string | null
          facebook?: string | null
          id?: string
          image_url?: string | null
          image_url_2?: string | null
          image_url_3?: string | null
          instagram?: string | null
          is_featured?: boolean
          is_premium?: boolean
          is_verified?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id?: string | null
          phone?: string | null
          price_range?: string | null
          rating?: number | null
          schedule_display?: string | null
          short_description?: string | null
          status?: string
          tiktok?: string | null
          updated_at?: string
          video_url?: string | null
          views_count?: number
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          description?: string
          email?: string | null
          facebook?: string | null
          id?: string
          image_url?: string | null
          image_url_2?: string | null
          image_url_3?: string | null
          instagram?: string | null
          is_featured?: boolean
          is_premium?: boolean
          is_verified?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          price_range?: string | null
          rating?: number | null
          schedule_display?: string | null
          short_description?: string | null
          status?: string
          tiktok?: string | null
          updated_at?: string
          video_url?: string | null
          views_count?: number
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          end_date: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          latitude: number | null
          location: string | null
          longitude: number | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      forum_comments: {
        Row: {
          author_email: string | null
          author_name: string
          content: string
          created_at: string
          id: string
          likes: number
          post_id: string
        }
        Insert: {
          author_email?: string | null
          author_name?: string
          content: string
          created_at?: string
          id?: string
          likes?: number
          post_id: string
        }
        Update: {
          author_email?: string | null
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          likes?: number
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          author_avatar: string | null
          author_email: string | null
          author_name: string
          category: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_approved: boolean
          likes: number
          place_name: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          author_avatar?: string | null
          author_email?: string | null
          author_name?: string
          category?: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          likes?: number
          place_name?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          author_avatar?: string | null
          author_email?: string | null
          author_name?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          likes?: number
          place_name?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          is_active?: boolean
          name?: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          log_type: string
          message: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          log_type: string
          message?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          log_type?: string
          message?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
