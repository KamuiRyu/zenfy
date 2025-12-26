import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import axios, { AxiosRequestConfig } from "axios";

const API_URL = process.env.API_URL || "http://localhost:8080/api";

export async function forwardRequest(
  req: NextRequest,
  resource: string,
  slug?: string[]
) {
  const tail = slug && slug.length ? `/${slug.join("/")}` : "";
  const url = `${API_URL}/${resource}${tail}${req.nextUrl.search}`;

  const headers: Record<string, string> = {};
  for (const [k, v] of req.headers) {
    if (k.toLowerCase() === "host") continue;
    headers[k] = v as string;
  }

  try {
    let t = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    let access =
      (t as any)?.accessToken || (t as any)?.token || (t as any)?.access;
    if (t && (t as any).expiresAt && Date.now() >= (t as any).expiresAt * 1000) {
      try {
        const refreshRes = await axios.post(`${API_URL}/auth/refresh`, {}, {
          headers: {
            "Authorization": `Bearer ${(t as any).refreshToken}`,
            "Content-Type": "application/json",
          },
        });
        if (refreshRes.status === 200 && refreshRes.data.data) {
          access = refreshRes.data.data.token;
        }
      } catch (refreshError) {
        console.error("Failed to refresh token in proxy:", refreshError);
      }
    }

    if (access) headers["authorization"] = `Bearer ${access}`;
  } catch {}

  const config: AxiosRequestConfig = {
    method: req.method as any,
    url,
    headers,
    validateStatus: () => true,
    responseType: "arraybuffer",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      const buffer = await req.arrayBuffer();
      if (buffer && buffer.byteLength) {
        config.data = Buffer.from(buffer);
      }
    } catch {}
  }

  try {
    const response = await axios.request(config);

    const resHeaders: Record<string, string> = {};
    Object.entries(response.headers).forEach(([k, v]) => {
      if (typeof v === "string") resHeaders[k] = v;
    });

    return new NextResponse(response.data, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Proxy request failed", details: error.message },
      { status: 500 }
    );
  }
}

