import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const { data: script, error } = await getSupabase()
    .from("scripts")
    .select("*")
    .eq("share_token", token)
    .single();

  if (error || !script) {
    return NextResponse.json(
      { error: "Guion no encontrado" },
      { status: 404 }
    );
  }

  const { data: comments } = await getSupabase()
    .from("comments")
    .select("*")
    .eq("script_id", script.id)
    .order("created_at", { ascending: true });

  // Recent episodes for sidebar
  const { data: recentEpisodes } = await getSupabase()
    .from("scripts")
    .select("id, title, guest_name, episode_number, season_number, status, share_token")
    .eq("podcast", "ladrando-ideas")
    .in("status", ["approved", "recorded"])
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({
    ...script,
    comments: comments || [],
    recentEpisodes: recentEpisodes || [],
  });
}
