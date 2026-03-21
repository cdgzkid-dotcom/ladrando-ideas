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

  return NextResponse.json({ ...script, comments: comments || [] });
}
