import { Token } from "@/types/front/globals";

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: BodyInit | Record<string, unknown>;
  params?: Record<string, string | number>;
  token?: Token;
  cache?: RequestCache;
}

type ApiErrorData = {
  message?: string;
  error?: {
    message?: string;
  };
  [key: string]: unknown;
};

export class ApiFetchError extends Error {
  response: {
    status: number;
    data: ApiErrorData;
  };

  constructor(status: number, data: ApiErrorData) {
    const message = data.error?.message ?? data.message ?? fallbackErrorMessage(status);
    super(message);
    this.name = "ApiFetchError";
    this.response = { status, data };
  }
}

function fallbackErrorMessage(status: number) {
  if (status === 400) return "badRequest";
  if (status === 401) return "unauthorized";
  if (status === 404) return "notFound";
  return "serverError";
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

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method,
      headers: allHeaders,
      body: finalBody,
      cache,
    });
  } catch (error) {
    throw new ApiFetchError(0, {
      error: { message: "serverError" },
      message: error instanceof Error ? error.message : "networkError",
    });
  }

  // ---------- هندل پاسخ ----------
  if (!res.ok) {
    let data: ApiErrorData = {};

    try {
      data = (await res.json()) as ApiErrorData;
    } catch {
      const text = await res.text();
      if (text) {
        data = { message: text };
      }
    }

    const message = data.error?.message ?? data.message ?? fallbackErrorMessage(res.status);
    if (!data.error) {
      data.error = { message };
    } else if (!data.error.message) {
      data.error.message = message;
    }

    throw new ApiFetchError(res.status, data);
  }

  // اگه response خالی بود (204 مثلاً)، json نخوان
  if (res.status === 204) return {} as T;

  return res.json();
}
