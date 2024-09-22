import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
	await dbConnect();
	try {
		const { username, email, name, password } = await request.json();
		const existingUserVerifiedByUsername = await UserModel.findOne({
			username,
			isverified: true,
		});

		if (existingUserVerifiedByUsername) {
			return Response.json(
				{
					success: false,
					message: "Username is already taken",
				},
				{ status: 400 }
			);
		}

		const existingUserByEmail = await UserModel.findOne({ email });
		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (existingUserByEmail) {
			if (existingUserByEmail.isVerified) {
				return Response.json(
					{
						success: false,
						message: "User already exist with this email.",
					},
					{ status: 400 }
				);
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);
				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.verifyCode = verifyCode;
				const expiryDate = new Date();
				expiryDate.setMinutes(expiryDate.getMinutes() + 10);
				existingUserByEmail.verifyCodeExpiry = expiryDate;

        await existingUserByEmail.save();
			}
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setMinutes(expiryDate.getMinutes() + 10);

			const newUser = await UserModel.create({
				username,
				name,
				password: hashedPassword,
				email,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				messages: [],
			});
		}

		// Send Verification email
		const emailResponse = await sendVerificationEmail(
			email,
			username,
			verifyCode
		);

		if (!emailResponse.success) {
			return Response.json(
				{
					success: false,
					message: emailResponse.message,
				},
				{ status: 500 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "User registered successfully. Please verify your email.",
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error registering user: ", error);
		return Response.json(
			{
				success: false,
				message: "Error registering user.",
			},
			{ status: 500 }
		);
	}
}
