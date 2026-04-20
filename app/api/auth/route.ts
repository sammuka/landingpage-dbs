import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("dbs_auth", process.env.SITE_PASSWORD!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
