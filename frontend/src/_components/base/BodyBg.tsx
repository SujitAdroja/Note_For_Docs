const BodyBg = () => {
	return (
		<div
			className="absolute inset-0 -z-1"
			style={{
				backgroundImage:
					"radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.1) 1px, transparent 0)",
				backgroundSize: "20px 20px",
			}}
		/>
	);
};

export default BodyBg;
