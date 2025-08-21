const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(data: { email: string; password: string }) {
	const res = await fetch(`${API_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
		credentials: "include",
	});
	if (!res.ok) throw new Error("Failed to login");
	return res.json();
}

export async function logout() {
	const res = await fetch(`${API_URL}/auth/logout`, {
		method: "POST",
		credentials: "include",
	});
	localStorage.removeItem("token");
	if (!res.ok) throw new Error("Failed to logout");
	return res.json();
}
