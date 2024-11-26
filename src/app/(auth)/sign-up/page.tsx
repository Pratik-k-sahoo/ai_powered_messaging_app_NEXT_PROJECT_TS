"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Page = () => {
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const debounced = useDebounceCallback(setUsername, 500);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof SignUpSchema>>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			name: "",
		},
	});

	useEffect(() => {
		const chechUsernameUnique = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage("");

				try {
					const response = await axios.get(
						`/api/check-username-unique?username=${username}`
					);

					if (response) {
						setUsernameMessage(response.data.message);
					}
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message ?? "Error checking messages"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};

		chechUsernameUnique();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post(`/api/sign-up`, data);
			if (response.data.success) {
				toast({
					title: "Success",
					description: response.data.message,
				});
				router.replace(`/verify/${username}`);
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			const errorMessage = axiosError.response?.data.message;
			toast({
				title: "Signup Failed",
				description: errorMessage ?? "Error signing up",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6 flex flex-col items-start justify-center px-4 py-2"
					>
						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="Username"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												debounced(e.target.value);
											}}
										/>
									</FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
									<FormDescription>
										{(usernameMessage.length > 0 && usernameMessage) ||
											"Enter username to check uniqueness"}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="Email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fullname</FormLabel>
									<FormControl>
										<Input placeholder="Fullname" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="Password" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="mx-auto" type="submit" disabled={isSubmitting}>
							{isSubmitting ? <Loader2 className="animate-spin" /> : "Sign Up"}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Page;
