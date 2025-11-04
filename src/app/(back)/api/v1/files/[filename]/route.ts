import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filePath = path.join(process.cwd(), "uploads", params.filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (err) {
    console.error("[SERVE_FILE]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
