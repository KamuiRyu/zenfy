import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.API_URL || "http://localhost:8080/api";

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
          const payload = await res.json().catch(() => null);
          if (!res.ok) {
            let message = "Authentication failed";

            if (payload && typeof payload === "object") {
              const code = (payload as any).code;
              const msg = (payload as any).message ?? (payload as any).error ?? null;

              if (code) {
                const errObj: any = { code, message: msg ?? message };
                if ((payload as any).errors) errObj.errors = (payload as any).errors;
                throw new Error(JSON.stringify(errObj));
              }

              if ((payload as any).message) message = (payload as any).message;
              else if ((payload as any).error) message = typeof (payload as any).error === "string" ? (payload as any).error : JSON.stringify((payload as any).error);
              else if ((payload as any).errors && Array.isArray((payload as any).errors)) {
                try {
                  const parts: string[] = [];
                  for (const e of (payload as any).errors) {
                    if (typeof e === "object") {
                      for (const k of Object.keys(e)) {
                        parts.push(`${k}: ${e[k]}`);
                      }
                    }
                  }
                  if (parts.length) message = parts.join(", ");
                } catch (e) {
                  // ignore
                }
              }
            }

            throw new Error(message);
          }

          const user = payload?.data || null;
          if (!user) throw new Error("Invalid response from auth server");
          return {
            id: user.uuid,
            name: user.name,
            email: user.email,
            image: user.avatar_url,
            accessToken: user.token_data?.token,
            refreshToken: user.token_data?.refresh,
          } as any;
        } catch (err: any) {
          throw new Error(err?.message || "Authentication error");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.uuid = user.id;
        // ensure avatar/image is persisted in token
        token.image = user.image || user.avatar_url || token.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          uuid: token.uuid,
          image: token.image,
        },
      } as any;
    },
  },
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
