import { cookies } from "next/headers";

export const authenticated = async () => {
	const token = (await cookies()).get("token");
	return token !== undefined;
};
