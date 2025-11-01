import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // هدرهای CORS
  res.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_APP_MODE === "production"
      ? "http://localhost:3000"
      : "*"
  );
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: res.headers,
    });
  }

  return res;
}

// فقط روی مسیرهای API
export const config = {
  matcher: ["/api/:path*"],
};
