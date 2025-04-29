import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        wallet: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[GET_USERS]", error);
    return NextResponse.json(
      { error: { message: "serverError" } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, password, countryCode, phoneNumber, fullName } =
      await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        fullName: fullName,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("[CREATE_USER]", error);
    return NextResponse.json(
      { error: { message: "serverError" } },
      { status: 500 }
    );
  }
}
