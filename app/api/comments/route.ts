import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await getSupabase()
    .from("comments")
    .insert({
      script_id: body.script_id,
      section: body.section || null,
      content: body.content,
      author_name: body.author_name || "Invitado",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
