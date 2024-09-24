import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
	email: string,
	username: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {
    console.log(email);    
		await resend.emails.send({
			from: process.env.SEND_EMAIL_FROM || "",
			to: email,
			subject: "MyNext-App | Verification Code",
			react: VerificationEmail({ username, otp: verifyCode }),
		});
		return {
			success: true,
			message: "Verification email sent successfully.",
		};
	} catch (error) {
		console.error("Error sending verification email: ", error);
		return {
			success: false,
			message: "Failed to send verification email.",
		};
	}
}
