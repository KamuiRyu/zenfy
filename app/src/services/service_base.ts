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
          token = (session as any)?.user?.accessToken ?? null;
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
  opts: AxiosRequestConfig = {}
) {
  try {
    const fullPath = path ? (path.startsWith("/") ? path : `${base}/${path}`) : base;
    const response = await apiClient.request({
      url: fullPath,
      ...opts,
    });
    return response.data;
  } catch (error: any) {
    const err: any = new Error("API error");
    err.status = error.response?.status;
    err.body = error.response?.data;
    throw err;
  }
}
