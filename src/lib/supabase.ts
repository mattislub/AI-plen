import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  theme: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  created_at: string;
  updated_at: string;
};

export type Page = {
  id: string;
  project_id: string;
  name: string;
  title: string;
  page_type: string;
  order: number;
  created_at: string;
  updated_at: string;
};

export type PageSection = {
  id: string;
  page_id: string;
  section_type: string;
  content: Record<string, any>;
  order: number;
  created_at: string;
  updated_at: string;
};

export type AIConversation = {
  id: string;
  project_id: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  created_at: string;
  updated_at: string;
};
