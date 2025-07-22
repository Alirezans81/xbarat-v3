import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { depositService } from "@/lib/back/services/wallet/deposit.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;

    const userOwnsDeposit = await depositService.userOwnsTheDeposit(
      payload.id,
      id
    );
    if (!userOwnsDeposit) return UnauthorizedResponse;

    const formData = await request.formData();
    const file = formData.get("document") as File;

    if (!file) {
      return NextResponse.json({ error: "noFileUploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create target folder
    const uploadDir = path.join(process.cwd(), "public/uploads");
    fs.mkdirSync(uploadDir, { recursive: true });

    // Generate a unique name
    const sanitizedFileName = file.name
      .replace(/[^a-z0-9_.-]/gi, "_")
      .toLowerCase();
    const fileName = `${Date.now()}-${id}-${sanitizedFileName}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file asynchronously
    fs.writeFileSync(filePath, buffer);

    // Construct accessible file URL
    const host = request.headers.get("host");
    const protocol =
      process.env.NEXT_PUBLIC_APP_MODE === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    const fileUrl = `${baseUrl}/uploads/${fileName}`;

    // Update deposit with file URL
    const newDeposit = await depositService.updateById(id, {
      documentUrl: fileUrl,
      status: "COMPLETED",
    });

    return NextResponse.json(newDeposit, { status: 200 });
  } catch (error) {
    console.error("[UPLOAD_DEPOSIT_DOCUMENT]", error);
    return ServerErrorResponse;
  }
}
