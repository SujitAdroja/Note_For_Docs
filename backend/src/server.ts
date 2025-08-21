import app from "./app";
import config from "./config";

const PORT = config.PORT || 3001;
const server = app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err: any) => {
	if (err.code === "EADDRINUSE") {
		console.error(
			`❌ Port ${PORT} is already in use. Close the process or use another port.`,
		);
		process.exit(1);
	} else {
		throw err;
	}
});
