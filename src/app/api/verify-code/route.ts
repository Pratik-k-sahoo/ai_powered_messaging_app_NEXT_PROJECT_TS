import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { username, code } = await request.json();

		// If through URI then decode the uri
		// const decodedUsername = decodeURIComponent(username);

		const user = await UserModel.findOne({ username, verifyCode: code });

		if (!user) {
			return Response.json(
				{
					message: "Invalid verification code.",
					success: false,
				},
				{ status: 400 }
			);
		}

		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if(!isCodeNotExpired) {
      return Response.json(
        {
          message: "Verification code has expired. Please signup again to get a new code.",
          success: false,
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();
    return Response.json(
			{
				message: "User verified successfully",
				success: true,
			},
			{ status: 200 }
		);

	} catch (error) {
		console.error("Error verifying user: ", error);
		return Response.json(
			{
				message: "Error verifying user.",
				success: false,
			},
			{ status: 500 }
		);
	}
}
