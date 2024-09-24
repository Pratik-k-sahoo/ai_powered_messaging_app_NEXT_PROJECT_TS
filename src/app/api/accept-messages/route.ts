import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { User } from "next-auth";

export async function POST(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	if (!session || !session?.user) {
		return Response.json(
			{
				message: "Not Authenticated.",
				success: false,
			},
			{ status: 401 }
		);
	}

	const user = session?.user;
	const userId = user._id;
	const { acceptMessages } = await request.json();

	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{
				isAcceptingMessages: acceptMessages,
			},
			{ new: true }
		);

		if (!updatedUser) {
			return Response.json(
				{
					message: "Failed to update user status to accept messages.",
					success: false,
				},
				{ status: 401 }
			);
		}

		return Response.json(
			{
				message: "Updated user status successfully to accept messages.",
				success: true,
				updatedUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to update user status to accept messages: ", error);
		return Response.json(
			{
				message: "Failed to update user status to accept messages.",
				success: false,
			},
			{ status: 500 }
		);
	}
}

export async function GET(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	if (!session || !session?.user) {
		return Response.json(
			{
				message: "Not Authenticated.",
				success: false,
			},
			{ status: 401 }
		);
	}

	const user = session?.user;
	const userId = user._id;
	try {
		const userDoc = await UserModel.findById(userId);

		if (!userDoc) {
			return Response.json(
				{
					message: "User not found.",
					success: false,
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				isAcceptingMessages: userDoc.isAcceptingMessages,
				success: true,
			},
			{ status: 200 }
		);
	} catch (error) {
    console.error("Error is getting message acceptance status: ", error);
    return Response.json(
			{
				message: "Error is getting message acceptance status.",
				success: false,
			},
			{ status: 500 }
		);
  }
}
