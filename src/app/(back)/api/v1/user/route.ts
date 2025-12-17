import { userService } from "@/lib/back/services/user.service";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = userService.checkUserIsAdmin(payload.id);
    if (!userIsAdmin) return UnauthorizedResponse;

    const users = await userService.getAll();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("[GET_USERS]", error);
    return ServerErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, phoneNumber, countryCode } = body;
    if (!email || !password || !fullName || !phoneNumber || !countryCode) {
      return MissingFieldsResponse;
    }

    const { user, token, token_exp } = await userService.register({
      email,
      password,
      fullName,
      phoneNumber,
      countryCode,
    });

    const cookiesStore = await cookies();
    const expiresMs = Number(token_exp ?? 0) * 1000;
    const expiresDate = new Date(Date.now() + expiresMs);
    const tokenData = {
      value: token,
      expiration: expiresDate.toLocaleDateString(),
    };
    cookiesStore.set("token", JSON.stringify(tokenData), {
      path: "/",
      expires: expiresDate,
      httpOnly: true,
    });

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error) {
    console.error("[SIGNUP]", error);

    const isServerError =
      error instanceof Error && error.message === "emailAlreadyRegistered"
        ? false
        : true;

    return isServerError
      ? ServerErrorResponse
      : NextResponse.json(
          { error: { message: "emailAlreadyRegistered" } },
          { status: 400 }
        );
  }
}
