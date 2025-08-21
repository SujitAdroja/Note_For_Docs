import { Patient } from "../../drizzle/schema/schema";
import { GlobalCache } from "../../utils/cache";
import { PatientService } from "./patient.services";
import { Request, Response } from "express";

const patientsCache = new GlobalCache<{ data: Patient[]; total: number }>(
	24 * 60 * 60 * 1000, // 1 day TTL
);

function clearPatientsCache() {
	patientsCache.clearByPrefix("patients_page_");
}
export const PatientController = {
	async getAllWithPagination(req: Request, res: Response) {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 5;

		const cacheKey = `patients_page_${page}_limit_${limit}`;
		const cached = patientsCache.get(cacheKey);
		if (cached) {
			console.log(`Serving patients from cache: ${cacheKey}`);
			return res.json({ ...cached, cached: true });
		}

		const offset = (page - 1) * limit;
		const result = await PatientService.getAllWithPagination(
			page,
			limit,
			offset,
		);

		if (result && result.data) {
			const clone = JSON.parse(JSON.stringify(result));
			patientsCache.set(cacheKey, clone);
		}

		return res.json({ ...result, cached: false });
	},

	async getAll(_: Request, res: Response) {
		const result = await PatientService.getAll();
		return res.json(result);
	},

	async getById(req: Request, res: Response) {
		const result = await PatientService.getById(req.params.id);
		return res.json(result);
	},

	async create(req: Request, res: Response) {
		const result = await PatientService.create(req.body);
		clearPatientsCache();
		return res.json(result);
	},

	async update(req: Request, res: Response) {
		const result = await PatientService.update(req.params.id, req.body);
		clearPatientsCache();
		return res.json(result);
	},

	async delete(req: Request, res: Response) {
		const result = await PatientService.delete(req.params.id);
		clearPatientsCache();
		return res.status(200).send(result);
	},
};
