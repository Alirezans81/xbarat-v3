import { NextResponse } from "next/server";

export const UnauthorizedResponse = NextResponse.json(
  { error: { message: "unauthorized" } },
  { status: 401 }
);

export const ServerErrorResponse = NextResponse.json(
  { error: { message: "serverError" } },
  { status: 500 }
);

export const NotFoundResponse = NextResponse.json(
  { error: { message: "notFound" } },
  { status: 404 }
);
