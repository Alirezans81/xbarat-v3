import { userService } from "@/lib/back/services/user.service";
import { ServerErrorResponse } from "@/lib/back/utils/globalResponses.utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const { user, token, token_exp } = await userService.login({
      email,
      password,
    });

    return NextResponse.json({ user, token, token_exp });
  } catch (error) {
    console.error("[LOGIN]", error);
    const isServerError =
      error instanceof Error && error.message === "wrongEmailPassword"
        ? false
        : true;

    return isServerError
      ? ServerErrorResponse
      : NextResponse.json(
          { error: { message: "wrongEmailPassword" } },
          { status: 401 }
        );
  }
}
