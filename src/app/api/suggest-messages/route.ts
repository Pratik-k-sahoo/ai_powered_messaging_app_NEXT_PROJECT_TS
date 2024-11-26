import { createAzure } from "@ai-sdk/azure";
import OpenAI from "openai";
import { generateText, convertToCoreMessages, streamText } from "ai";
import { NextResponse } from "next/server";

// Create an OpenAI API client
const openai = createAzure({
	baseURL: "https://mynextappapi.openai.azure.com/openai/deployments",
	apiKey: "e0065bbebb12495795b046cc7dd5f526",
});

// Set the runtime to edge for best performance
export const runtime = "edge";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
	try {
		const prompt =
			"Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
		console.log("Prompt");

		const result = await streamText({
			model: openai.completion("myNextAppDeployment"),
			prompt,
			maxTokens: 512,
			temperature: 0.3,
			maxRetries: 5,
		});
		console.log("Result");
    const finish = result.finishReason;
		console.log("Reason: ", finish);
		const reader = result.textStream.getReader();

		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			console.log(value);
		}
		

		return Response.json({
			message: "Completed",
		});
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			const { name, status, headers, message } = error;
			console.error(message);
			return NextResponse.json(
				{
					name,
					status,
					headers,
					message,
				},
				{ status }
			);
		} else {
			console.error("An unexpected error occurred: ", error);
			throw error;
		}
	}
}
