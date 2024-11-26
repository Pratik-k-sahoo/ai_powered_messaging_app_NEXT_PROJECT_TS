import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";

export async function DELETE(
	request: Request,
	{ params }: { params: { messageId: string } }
) {
	const messageId = params.messageId;
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

	try {
		const updatedResult = await UserModel.updateOne(
			{ _id: user._id },
			{ $pull: { messages: { _id: messageId } } }
		);

		if (updatedResult.modifiedCount === 0) {
			return Response.json(
				{
					message: "Message not found or already deleted.",
					success: false,
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				message: "Message deleted successfully.",
				success: true,
			},
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{
				message: "Error deleting message",
				success: false,
			},
			{ status: 500 }
		);
	}
}
