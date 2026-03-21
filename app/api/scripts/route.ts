import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await getSupabase()
    .from("scripts")
    .select("*")
    .eq("podcast", "ladrando-ideas")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await getSupabase()
    .from("scripts")
    .insert({
      podcast: "ladrando-ideas",
      title: body.title,
      guest_name: body.guest_name,
      guest_profile: body.guest_profile || null,
      episode_number: body.episode_number || null,
      season_number: body.season_number || null,
      content: body.content,
      status: "draft",
    })
    .select("id, share_token")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
