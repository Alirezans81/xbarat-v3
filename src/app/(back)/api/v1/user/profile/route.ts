import { r2 } from "@/lib/back/r2";
import { userService } from "@/lib/back/services/user.service";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const user = await userService.getById(payload.id);

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("[GET_USER", error);
    return ServerErrorResponse;
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const body = await request.json();
    const {
      fullName,
      phoneNumber,
      countryCode,
      nationality,
      city,
      documentNumber,
      address,
      document,
    } = body;

    if (
      !fullName ||
      !phoneNumber ||
      !countryCode ||
      !nationality ||
      !city ||
      !documentNumber ||
      !address
    ) {
      return MissingFieldsResponse;
    }

    let fileUrl: string | undefined = undefined;

    if (document) {
      const file = document;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const sanitizedFileName = file.name
        .replace(/[^a-z0-9_.-]/gi, "_")
        .toLowerCase();

      const fileName = `${Date.now()}-${payload.id}-${sanitizedFileName}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        })
      );

      fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
    }

    const newUser = await userService.updateUser(payload.id, {
      fullName,
      phoneNumber,
      countryCode,
      nationality,
      city,
      documentNumber,
      address,
      documentUrl: fileUrl,
    });

    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_USER]", error);
    return ServerErrorResponse;
  }
}
