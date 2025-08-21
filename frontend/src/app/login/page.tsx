"use client";
import { Button } from "@f/components/ui/button";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@f/apis/auth";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormInputs>({
		resolver: zodResolver(loginSchema),
	});

	const onLogin = async (data: LoginFormInputs) => {
		setIsLoading(true);
		try {
			const res = await login(data);
			localStorage.setItem("token", res.token);
			if (res) {
				router.push("/n4d/patients");
			}
			setIsLoading(false);
		} catch (error) {
			toast.error(`Failed to login: \n${error}`);
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
			<form
				onSubmit={handleSubmit(onLogin)}
				className="max-w-md w-full bg-white p-8 rounded z-10 relative border-2 border-black hover:shadow-[8px_8px_0px_rgba(0,0,0,0.1)] duration-300"
				noValidate
			>
				<div className="mb-8 flex items-center justify-center w-full">
					<Image src="/logo.png" alt="logo" width={120} height={120} />
				</div>

				<label htmlFor="email" className="block mb-1 font-semibold">
					Email
				</label>
				<input
					id="email"
					type="email"
					{...register("email")}
					className={`w-full p-3 mb-4 rounded border-2 ${
						errors.email
							? "border-red-600 shadow-[0_0_5px_red]"
							: "border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]"
					} focus:outline-none duration-300`}
					placeholder="your.email@example.com"
				/>
				{errors.email && (
					<p className="mb-3 text-red-600 text-sm">{errors.email.message}</p>
				)}

				<label htmlFor="password" className="block mb-1 font-semibold">
					Password
				</label>
				<input
					id="password"
					type="password"
					{...register("password")}
					className={`w-full p-3 mb-4 rounded border-2 ${
						errors.password
							? "border-red-600 shadow-[0_0_5px_red]"
							: "border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]"
					} focus:outline-none duration-300`}
					placeholder="••••••••••"
				/>
				{errors.password && (
					<p className="mb-3 text-red-600 text-sm">{errors.password.message}</p>
				)}

				<Button
					type="submit"
					variant="primary"
					className="w-full mt-8 h-12"
					disabled={isSubmitting}
				>
					{isLoading ? (
						<Loader2 className="w-4 h-4 animate-spin text-black" />
					) : (
						"Login"
					)}
				</Button>
			</form>

			<div className="absolute top-0 left-0 bg-orange-100 border-2 border-black text-black py-2 px-4 rounded-lg">
				<div className="text-lg font-bold">Demo Login</div>
				<div className="text-sm">
					Email: <b>sharmil@gmail.com</b>
				</div>
				<div className="text-sm">
					Password: <b>123456</b>
				</div>
			</div>
		</div>
	);
};

export default Login;
