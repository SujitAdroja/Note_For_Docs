import express from "express";
import cors from "cors";
import patientRoutes from "./api/patient/patient.routers";
import noteRoutes from "./api/note/note.routers";
import authRoutes from "./api/auth/auth.routers";
import cookieParser from "cookie-parser";
import config from "./config";

const app = express();

app.use(
	cors({
		origin: config.FRONTEND_ENDPOINT,
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (_, res) => {
	res.json({
		message: "Backend is running",
		success: true,
	});
});

export default app;
