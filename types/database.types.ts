export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          total_stars: number | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          total_stars?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          total_stars?: number | null
          created_at?: string
        }
      }
      missions: {
        Row: {
          id: number
          title: string
          difficulty_level: number
        }
        Insert: {
          id?: number
          title: string
          difficulty_level?: number
        }
        Update: {
          id?: number
          title?: string
          difficulty_level?: number
        }
      }
      mission_progress: {
        Row: {
          id: string
          user_id: string
          mission_id: number
          is_unlocked: boolean | null
          is_completed: boolean | null
          best_score: number | null
          attempts: number | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          mission_id: number
          is_unlocked?: boolean | null
          is_completed?: boolean | null
          best_score?: number | null
          attempts?: number | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          mission_id?: number
          is_unlocked?: boolean | null
          is_completed?: boolean | null
          best_score?: number | null
          attempts?: number | null
          completed_at?: string | null
        }
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string
          mission_id: number
          questions_total: number
          correct_answers: number
          time_spent_seconds: number
          started_at: string
          ended_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          mission_id: number
          questions_total?: number
          correct_answers?: number
          time_spent_seconds?: number
          started_at?: string
          ended_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          mission_id?: number
          questions_total?: number
          correct_answers?: number
          time_spent_seconds?: number
          started_at?: string
          ended_at?: string | null
        }
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
