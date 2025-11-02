import { Token } from "@/types/front/globals";

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
  token?: Token; // برای client-side
  cache?: RequestCache;
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    params,
    token,
    cache = "no-store",
  } = options;

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const url = new URL(`${baseUrl}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, String(value))
    );
  }

  const allHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token?.value ? { Authorization: `Bearer ${token.value}` } : {}),
    ...headers,
  };

  const res = await fetch(url.toString(), {
    method,
    headers: allHeaders,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json();
}
