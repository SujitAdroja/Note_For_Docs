"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth<P extends object>(
	Component: React.ComponentType<P>,
) {
	return function ProtectedRoute(props: P) {
		const router = useRouter();

		useEffect(() => {
			const token = localStorage.getItem("token");
			if (!token) {
				router.replace("/login");
			}
		}, [router]);

		return <Component {...props} />;
	};
}
