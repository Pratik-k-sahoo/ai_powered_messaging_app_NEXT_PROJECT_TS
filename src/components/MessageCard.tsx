"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/UserModel";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProp = {
	message: Message;
	onMessageDelete: (messageId) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProp) => {
	const { toast } = useToast();

	const handleDeleteConfirm = async () => {
		const response = await axios.delete<ApiResponse>(
			`/api/delete-message/${message._id}`
		);
		toast({
			title: response.data.message,
		});
		onMessageDelete(message._id);
	};

	return (
		<Card className="shadow-md dark:bg-slate-800">
			<CardHeader className="flex">
				<CardTitle className="inline">Annonymous Message</CardTitle>
				<span>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">
								<X className="w-5 h-5" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete
									your account and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDeleteConfirm}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</span>
			</CardHeader>
			<CardDescription className="ml-7">
				{message.createdAt.toString().split("T")[0]}
			</CardDescription>
			<CardContent>{message.content}</CardContent>
		</Card>
	);
};

export default MessageCard;
