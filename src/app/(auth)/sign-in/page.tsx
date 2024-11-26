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
import { SignInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
		setIsSubmitting(true);
		const result = await signIn("credentials", {
			redirect: false,
			identifier: data.identifier,
			password: data.password,
		});
		if (result?.error) {
			toast({
				title: "Login failed",
				description: "Incorrect username or password",
				variant: "destructive",
			});
		}

		if (result?.url) {
			router.replace("/dashboard");
		}
    setIsSubmitting(false);
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
							name="identifier"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email/Username</FormLabel>
									<FormControl>
										<Input type="text" placeholder="Email/Username" {...field} />
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
							{isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Page;
