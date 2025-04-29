import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.findUnique({
      where: {
        email,
        passwordHash: hashedPassword,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: { message: "wrongEmailPassword" } },
        { status: 400 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[LOGIN]", error);
    return NextResponse.json(
      { error: { message: "serverError" } },
      { status: 500 }
    );
  }
}
