import { NextResponse } from "next/server";

export interface FlashMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export function setFlash(
  response: NextResponse,
  flash: FlashMessage
): NextResponse {
  const cookie = Buffer.from(JSON.stringify(flash))
    .toString("base64")
    .replace(/=/g, "");
  response.cookies.set("flash", cookie, {
    httpOnly: false,
    path: "/",
    maxAge: 5,
  });
  return response;
}

export function getFlash(request: Request): FlashMessage | null {
  try {
    const cookie = new URL(request.url).searchParams.get("flash");
    if (!cookie) return null;
    const decoded = Buffer.from(cookie, "base64").toString("utf-8");
    return JSON.parse(decoded) as FlashMessage;
  } catch {
    return null;
  }
}
