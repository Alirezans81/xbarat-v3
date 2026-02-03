import { Token } from "@/types/front/globals";

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: BodyInit;
  params?: Record<string, string | number>;
  token?: Token;
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

  // ---------- تشخیص نوع body ----------
  let finalBody: BodyInit | undefined = undefined;
  const allHeaders: Record<string, string> = {
    ...(token?.value ? { Authorization: `Bearer ${token.value}` } : {}),
    ...headers,
  };

  if (body instanceof FormData) {
    // اگر FormData بود، خودش هندل میشه، نیازی به Content-Type نیست
    finalBody = body;
  } else if (body && typeof body === "object") {
    // اگر object بود، به JSON تبدیلش کن
    finalBody = JSON.stringify(body);
    allHeaders["Content-Type"] = "application/json";
  } else {
    // برای DELETE یا GET معمولاً body وجود نداره
    finalBody = body;
  }

  const res = await fetch(url.toString(), {
    method,
    headers: allHeaders,
    body: finalBody,
    cache,
  });

  // ---------- هندل پاسخ ----------
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  // اگه response خالی بود (204 مثلاً)، json نخوان
  if (res.status === 204) return {} as T;

  return res.json();
}
