import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { User } from "next-auth";
import mongoose from "mongoose";

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
	const userId = new mongoose.Types.ObjectId(user._id);

	try {
		const user = await UserModel.aggregate([
			{ $match: { id: userId } },
			{ $unwind: "$messages" },
			{ $sort: { "messages.createdAt": -1 } },
			{ $group: { _id: "$_id", messages: { $push: "$messages" } } },
		]);

		if (!user || user.length === 0) {
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
				messages: user[0].messages,
				success: true,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("An unexpected error occurred: ", error);
		return Response.json(
			{
				message: "An unexpected error occurred",
				success: false,
			},
			{ status: 500 }
		);
	}
}
