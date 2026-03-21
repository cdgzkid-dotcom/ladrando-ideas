import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

export type Script = {
  id: string;
  podcast: string;
  title: string;
  guest_name: string;
  guest_profile: string | null;
  episode_number: number | null;
  season_number: number | null;
  content: string;
  status: "draft" | "shared" | "approved" | "recorded";
  share_token: string;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  script_id: string;
  section: string | null;
  content: string;
  author_name: string;
  created_at: string;
};
