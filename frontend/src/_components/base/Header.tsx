"use client";
import { CircleUser, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { logout } from "@f/apis/auth";
import { useRouter } from "next/navigation";
import { Button } from "@f/components/ui/button";

const Header = () => {
	const pathname = usePathname();
	const router = useRouter();

	const onLogOut = async () => {
		await logout();
		router.push("/login");
	};

	return (
		<div className="sticky top-0 w-full bg-white/70 z-2 border-b-2 backdrop-blur-2xl">
			<div className="container mx-auto px-4 md:px-8 py-3">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<div className="text-2xl font-bold tracking-tighter mr-2">
							<a href="/n4d/patients">
								<Image src="/logo.png" alt="logo" width={70} height={70} />
							</a>
						</div>
						<div className="flex gap-4">
							<a
								href="/n4d/patients"
								className={`font-semibold hover:text-amber-600 ${
									pathname === "/n4d/patients" ? "text-amber-600 underline" : ""
								}`}
							>
								Patients
							</a>
							<a
								href="/n4d/notes"
								className={`font-semibold hover:text-amber-600 ${
									pathname === "/n4d/notes" ? "text-amber-600 underline" : ""
								}`}
							>
								Notes
							</a>
						</div>
					</div>
					<div className="flex gap-2 items-center">
						<div className="flex gap-1">
							<CircleUser />
							<div className="font-semibold">Hi, Sam!</div>
						</div>
						<Button onClick={onLogOut} variant="primary">
							<LogOut width={18} height={18} />
							<span>Logout</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
