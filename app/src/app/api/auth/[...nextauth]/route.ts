import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }

  interface Session {
    user: {
      accessToken?: string;
      refreshToken?: string;
      uuid?: string;
    } & DefaultSession["user"];
    expiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    uuid?: string;
    image?: string;
  }
}

const API_URL = process.env.API_URL || "http://localhost:8080/api";

type AuthErrorPayload = {
  code?: string;
  message?: string;
  error?: string | object;
  errors?: Array<Record<string, string>>;
};

type AuthUser = {
  uuid: string;
  name: string;
  email: string;
  avatar_url?: string;
  token_data?: {
    token: string;
    refresh: string;
    expires_at: number;
  };
};

type AuthResponse = {
  data: AuthUser;
};

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
          const payload: AuthResponse | AuthErrorPayload | null = await res.json().catch(() => null);
          if (!res.ok) {
            let message = "Authentication failed";

            if (payload && typeof payload === "object") {
              const errorPayload = payload as AuthErrorPayload;
              const code = errorPayload.code;
              const msg = errorPayload.message ?? errorPayload.error ?? null;

              if (code) {
                const errObj: { code: string; message: string | object; errors?: Array<Record<string, string>> } = { code, message: msg ?? message };
                if (errorPayload.errors) errObj.errors = errorPayload.errors;
                throw new Error(JSON.stringify(errObj));
              }

              if (errorPayload.message) message = errorPayload.message;
              else if (errorPayload.error) message = typeof errorPayload.error === "string" ? errorPayload.error : JSON.stringify(errorPayload.error);
              else if (errorPayload.errors && Array.isArray(errorPayload.errors)) {
                try {
                  const parts: string[] = [];
                  for (const e of errorPayload.errors) {
                    if (typeof e === "object") {
                      for (const k of Object.keys(e)) {
                        parts.push(`${k}: ${e[k]}`);
                      }
                    }
                  }
                  if (parts.length) message = parts.join(", ");
                } catch {
                  // ignore
                }
              }
            }

            throw new Error(message);
          }

          const authResponse = payload as AuthResponse;
          const user = authResponse?.data || null;
          if (!user) throw new Error("Invalid response from auth server");
          return {
            id: user.uuid,
            name: user.name,
            email: user.email,
            image: user.avatar_url,
            accessToken: user.token_data?.token,
            refreshToken: user.token_data?.refresh,
            expiresAt: user.token_data?.expires_at,
          };
        } catch (err) {
          throw new Error(err instanceof Error ? err.message : "Authentication error");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
      }

      if (token.expiresAt && Date.now() >= token.expiresAt * 1000) {
        try {
          const res = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token.refreshToken}`,
              "Content-Type": "application/json",
            },
          });
          const payload = await res.json();
          if (res.ok && payload.data) {
            token.accessToken = payload.data.token;
            token.refreshToken = payload.data.refresh_token;
            token.expiresAt = payload.data.expires_at;
          } else {
            console.error("Failed to refresh token:", payload);
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          uuid: token.uuid,
          image: token.image,
        },
        expiresAt: token.expiresAt,
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
