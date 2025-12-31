import axios, { AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("token");

      if (!token) {
        try {
          const session = await getSession();
          token = (session as { user?: { accessToken?: string } })?.user?.accessToken ?? null;
        } catch {}
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function setupAxiosInterceptors(onResponse: () => void): number | null {
  if (typeof window === "undefined") return null;

  const interceptorId = apiClient.interceptors.response.use(
    (response) => {
      onResponse();
      return response;
    },
    (error) => {
      onResponse();
      return Promise.reject(error);
    }
  );
  return interceptorId;
}

export function ejectAxiosInterceptor(interceptorId: number) {
  if (typeof window !== "undefined") {
    apiClient.interceptors.response.eject(interceptorId);
  }
}

export async function request(
  base: string,
  path: string,
  opts: AxiosRequestConfig = {},
  signal?: AbortSignal
) {
  try {
    const fullPath = path ? (path.startsWith("/") ? path : `${base}/${path}`) : base;
    const response = await apiClient.request({
      url: fullPath,
      signal,
      ...opts,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && (error.name === 'CanceledError' || error.name === 'AbortError')) {
      throw error;
    }
    const err = new Error("API error");
    (err as { status?: number; body?: unknown }).status = (error as { response?: { status?: number } })?.response?.status;
    (err as { status?: number; body?: unknown }).body = (error as { response?: { data?: unknown } })?.response?.data;
    return (err as { body?: unknown }).body;
  }
}
