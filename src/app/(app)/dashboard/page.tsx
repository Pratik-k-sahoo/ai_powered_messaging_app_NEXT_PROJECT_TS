"use client";
import { useCallback, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/UserModel";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import MessageCard from "@/components/MessageCard";
import { User } from "next-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

const Page = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState(false);

	const { toast } = useToast();

	const handleDeleteMessage = (messageId: string) => {
		setMessages(messages.filter((message) => message._id !== messageId));
	};

	const { data: session } = useSession();

	const form = useForm({
		resolver: zodResolver(AcceptMessageSchema),
	});

	const { register, watch, setValue } = form;
	const acceptMessages = watch("acceptMessages");

	const fetchAcceptMessages = useCallback(async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.get<ApiResponse>("/api/accept-messages");
			if (response.data.success) {
				setValue("acceptMessages", response.data.isAcceptingMessages);
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ??
					"Error fetching messages settings",
				variant: "destructive",
			});
		} finally {
			setIsSwitchLoading(false);
		}
	}, [setValue]);

	const fetchMessages = useCallback(
		async (refresh: boolean = false) => {
			setIsLoading(true);
			setIsSwitchLoading(false);
			try {
				const response = await axios.get<ApiResponse>("/api/get-messages");
				if (response.data.success) {
					setMessages(response.data.messages || []);
					if (refresh) {
						toast({
							title: "Refreshed Messages",
							description: "Showing latest messages.",
						});
					}
				}
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse>;
				toast({
					title: "Error",
					description:
						axiosError.response?.data.message ??
						"Error fetching messages settings",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		},
		[setIsLoading, setMessages]
	);

	useEffect(() => {
		if (!session || !session.user) return;
		fetchMessages();
		fetchAcceptMessages();
	}, [session, setValue, fetchAcceptMessages, fetchMessages]);

	// Handle Switch change
	const handleSwitchChange = async () => {
		try {
			const response = await axios.post<ApiResponse>("/api/accept-messages", {
				acceptMessages: !acceptMessages,
			});
			setValue("acceptMessages", !acceptMessages);
			toast({
				title: response.data.message,
				variant: "default",
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ??
					"Error switching messages settings",
				variant: "destructive",
			});
		}
	};

	if (!session || !session.user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Please Login or Signup</h1>
					<div className="space-x-4">
						<button className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700">
							Login
						</button>
						<button className="px-4 py-2 bg-green-500 rounded hover:bg-green-700">
							Signup
						</button>
					</div>
				</div>
			</div>
		);
	}

	let username = session?.user.username as User;
	if (!username) {
		username = "pratik";
	}
	const baseUrl = `${window.location.protocol}//${window.location.host}`;
	const profileUrl = `${baseUrl}/u/${username}`;

	const copyToClipboard = async () => {
		navigator.clipboard.writeText(profileUrl);
		toast({
			title: "URL copied",
			description: "Profile url has been copied to clipboard",
		});
	};

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-7xl mx-auto">
				<div className="p-6 rounded-lg shadow-lg mb-6">
					<h2 className="text-2xl font-bold mb-4">Dashboard</h2>
					<div className="my-4 flex flex-col">
						<div className="flex items-center justify-between mb-4 gap-2">
							<Input
								className="bg-gray-200 text-xl font-semibold dark:text-gray-900"
								type="text"
								value={profileUrl}
								disabled
							/>
							<Button
								onClick={copyToClipboard}
								className="px-4 py-2 rounded-md hover:bg-blue-400 transition duration-300"
							>
								Copy
							</Button>
						</div>
						<div className="flex items-center">
							<span className="mr-2">
								Accept Messages: {acceptMessages ? "On" : "Off"}
							</span>
							<Switch
								{...register("acceptMessages")}
								disabled={isSwitchLoading}
								checked={acceptMessages}
								onCheckedChange={handleSwitchChange}
							/>
						</div>
					</div>
					<Button
						onClick={(e) => {
							e.preventDefault();
							fetchMessages(true);
						}}
						variant="outline"
						className="mb-4"
					>
						{isLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
					</Button>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{messages.length > 0 ? (
							messages.map((message, index) => (
								<MessageCard
									key={message._id}
									message={message}
									onMessageDelete={handleDeleteMessage}
								/>
							))
						) : (
							<p>No Messages found</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
