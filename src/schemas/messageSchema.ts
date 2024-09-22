import { z } from "zod";

export const MessageSchema = z.object({
	content: z
		.string()
		.min(10, {
			message: "Content can't be empty. Minimum 10 characters required",
		})
		.max(300, {
			message: "Content must not exceeds 300 characters",
		}),
});
