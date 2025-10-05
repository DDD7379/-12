import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          discord_handle: string;
          roblox_username: string;
          roblox_profile_link: string;
          age: number;
          country: string;
          timezone: string;
          email: string;
          languages: string;
          motivation: string;
          scenario1: string;
          scenario2: string;
          weekly_availability: string;
          accepted_conduct: boolean;
          guardian_consent: boolean | null;
          project_links: string | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          discord_handle: string;
          roblox_username: string;
          roblox_profile_link: string;
          age: number;
          country: string;
          timezone: string;
          email: string;
          languages: string;
          motivation: string;
          scenario1: string;
          scenario2: string;
          weekly_availability: string;
          accepted_conduct: boolean;
          guardian_consent?: boolean | null;
          project_links?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          discord_handle?: string;
          roblox_username?: string;
          roblox_profile_link?: string;
          age?: number;
          country?: string;
          timezone?: string;
          email?: string;
          languages?: string;
          motivation?: string;
          scenario1?: string;
          scenario2?: string;
          weekly_availability?: string;
          accepted_conduct?: boolean;
          guardian_consent?: boolean | null;
          project_links?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          summary: string;
          content: string;
          image_url: string | null;
          publish_date: string;
          author: string;
          tags: string[];
          language: 'he' | 'en';
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary: string;
          content: string;
          image_url?: string | null;
          publish_date: string;
          author: string;
          tags: string[];
          language: 'he' | 'en';
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string;
          content?: string;
          image_url?: string | null;
          publish_date?: string;
          author?: string;
          tags?: string[];
          language?: 'he' | 'en';
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          country: string | null;
          discord_handle: string | null;
          roblox_username: string | null;
          is_admin: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          country?: string | null;
          discord_handle?: string | null;
          roblox_username?: string | null;
          is_admin?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          country?: string | null;
          discord_handle?: string | null;
          roblox_username?: string | null;
          is_admin?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      learning_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          current_step: number;
          quiz_completed: boolean;
          quiz_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          current_step?: number;
          quiz_completed?: boolean;
          quiz_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          completed?: boolean;
          current_step?: number;
          quiz_completed?: boolean;
          quiz_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}