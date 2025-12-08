import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { r2 } from "@/lib/back/r2";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "File missing" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileName = `${Date.now()}-${file.name}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })
  );

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

  return NextResponse.json({
    fileName,
    url: publicUrl,
  });
}
