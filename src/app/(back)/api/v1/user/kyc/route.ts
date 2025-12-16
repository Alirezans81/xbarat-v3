import { DocumentType } from "@/generated/prisma";
import { r2 } from "@/lib/back/r2";
import { userService } from "@/lib/back/services/user.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const formData = await request.formData();

    const documentType = formData.get("documentType") as DocumentType;
    const documentNumber = formData.get("documentNumber") as string;
    const documentPhoto = formData.get("documentPhoto") as File;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const postalCode = formData.get("postalCode") as string;

    let documentPhotoUrl: string | undefined = undefined;
    if (documentPhoto) {
      const file = documentPhoto;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const sanitizedFileName = file.name
        .replace(/[^a-z0-9_.-]/gi, "_")
        .toLowerCase();

      const fileName = `${Date.now()}-user-${sanitizedFileName}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        })
      );

      documentPhotoUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
    }

    const newUser = await userService.updateUser(payload.id, {
      documentType,
      documentNumber,
      documentPhotoUrl,
      dateOfBirth: new Date(dateOfBirth),
      address,
      city,
      state,
      postalCode,
    });

    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    console.error("[KYC_USER]", error);
    return ServerErrorResponse;
  }
}
