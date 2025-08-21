import { redirect } from "next/navigation";

export default function Home() {
	redirect("/n4d/patients");
	return null;
}
