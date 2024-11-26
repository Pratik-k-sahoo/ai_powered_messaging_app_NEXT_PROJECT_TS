"use client";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { VerifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyAccount = () => {
	const router = useRouter();
	const params = useParams<{ username: string }>();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof VerifySchema>>({
		resolver: zodResolver(VerifySchema),
		defaultValues: {
			code: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
		try {
			const response = await axios.post(`/api/verify-code`, {
				username: params.username,
				code: data.code,
			});

			if (response.data.success) {
				toast({
					title: "Success",
					description: response.data.message,
				});

				router.replace("/sign-in");
			} else {
				toast({
					title: "Failed",
					description: response.data.message,
				});
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			const errorMessage = axiosError.response?.data.message;
			toast({
				title: "Verification Failed",
				description: errorMessage ?? "Error signing up",
				variant: "destructive",
			});
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
							name="code"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification code</FormLabel>
									<FormControl>
										<Input placeholder="OTP" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="mx-auto" type="submit">
							Verify
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default VerifyAccount;
