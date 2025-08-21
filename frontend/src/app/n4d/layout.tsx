import Header from "@f/_components/base/Header";

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Header />
			<main>{children}</main>
		</>
	);
}
