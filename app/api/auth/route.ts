import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === process.env.STUDIO_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("studio-auth", "authenticated", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  return NextResponse.json({ error: "Password incorrecto" }, { status: 401 });
}
