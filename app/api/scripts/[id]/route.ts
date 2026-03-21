import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: script, error } = await getSupabase()
    .from("scripts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const { data: comments } = await getSupabase()
    .from("comments")
    .select("*")
    .eq("script_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ ...script, comments: comments || [] });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.content !== undefined) updates.content = body.content;
  if (body.status !== undefined) updates.status = body.status;
  if (body.title !== undefined) updates.title = body.title;
  if (body.guest_name !== undefined) updates.guest_name = body.guest_name;
  if (body.guest_profile !== undefined) updates.guest_profile = body.guest_profile;
  if (body.episode_number !== undefined) updates.episode_number = body.episode_number;
  if (body.season_number !== undefined) updates.season_number = body.season_number;

  const { data, error } = await getSupabase()
    .from("scripts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
