import bcrypt from "bcrypt";
import { prisma } from "@/utils/prismaDB";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const body = await request.json();
	const { email, password } = body;

	if (!email || !password) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	const formatedEmail = email.toLowerCase();

	const user = await prisma.company.findUnique({
		where: {
			adminEmail: formatedEmail,
		},
	});

	if (!user) {
		throw new Error("Email does not exists");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await prisma.company.update({
			where: {
			adminEmail: formatedEmail,
			},
			data: {
				password: hashedPassword,
				passwordResetToken: null,
				passwordResetTokenExp: null,
			},
		});

		return NextResponse.json("Password Updated", { status: 200 });
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
