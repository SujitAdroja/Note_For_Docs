import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const JWT_SECRET = config.JWT_SECRET;

interface JwtPayload {
	id: string;
	email: string;
}

export interface AuthenticatedRequest extends Request {
	user?: JwtPayload;
}

export const authMiddleware = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No token provided" });
		}

		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		req.user = decoded;

		next();
	} catch (error) {
		return res.status(401).json({ error: "Unauthorized: Invalid token" });
	}
};
