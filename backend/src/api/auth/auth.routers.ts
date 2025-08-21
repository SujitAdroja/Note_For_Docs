import config from "../../config";
import { Router } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();

const dummyUser = {
	email: "sharmil@gmail.com",
	password: "123456",
	id: "user-123",
};

router.post("/login", (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (email === dummyUser.email && password === dummyUser.password) {
		const token = jwt.sign(
			{ id: dummyUser.id, email: dummyUser.email },
			config.JWT_SECRET,
			{
				expiresIn: "1h",
			},
		);

		res.cookie("token", token, {
			httpOnly: true,
			secure: config.NODE_ENV === "production",
			sameSite: "none",
			maxAge: 60 * 60 * 1000,
			path: "/",
		});

		return res.json({ message: "Logged in successfully", token });
	}
	return res.status(401).json({ error: "Invalid email or password" });
});

router.post("/logout", (_: Request, res: Response) => {
	res.cookie("token", "", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		expires: new Date(0),
		path: "/",
	});
	res.json({ message: "Logged out successfully" });
});

export default router;
