import { Request, Response } from "express";
import { NoteService } from "./note.services";
import { GlobalCache } from "../../utils/cache";
import { Note } from "../../drizzle/schema/schema";
import { formatNoteWithPerplexity } from "../../utils/ai";
import {
	extractTextFromImageBuffer,
	extractTextFromPdfBufferWithOcrFallback,
} from "../../utils/ocr";

const notesCache = new GlobalCache<{ data: Note[]; total: number }>(
	24 * 60 * 60 * 1000,
);

function clearNotesCache() {
	notesCache.clearByPrefix("notes_page_");
}

export const NoteController = {
	async getAllWithPagination(req: Request, res: Response) {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 5;
		const filter = req.query.filter as string;

		const cacheKey = `notes_page_${page}_limit_${limit}_filter_${filter || ""}`;
		const cached = notesCache.get(cacheKey);
		if (cached) {
			console.log(`Serving from cache for key: ${cacheKey}`);
			return res.json({ ...cached, cached: true });
		}

		const offset = (page - 1) * limit;
		const result = await NoteService.getAllWithPagination(
			page,
			limit,
			offset,
			filter,
		);

		if (result && result.data) {
			const clone = JSON.parse(JSON.stringify(result));
			notesCache.set(cacheKey, clone);
		}

		return res.json({ ...result, cached: false });
	},

	async create(req: Request, res: Response) {
		const result = await NoteService.create(req.body);
		clearNotesCache();
		return res.json(result);
	},

	async upload(req: Request, res: Response) {
		try {
			let ocrText = "";
			const file = req.file;

			if (file) {
				if (file.mimetype === "application/pdf") {
					ocrText = await extractTextFromPdfBufferWithOcrFallback(file.buffer);
				} else if (file.mimetype.startsWith("image/")) {
					ocrText = await extractTextFromImageBuffer(file.buffer);
				} else {
					return res.status(400).json({ error: "Unsupported file type" });
				}
			}

			if (!ocrText) {
				return res.status(400).json({
					error:
						"Unable to extract text from the provided file. Try again with a different file.",
				});
			}
			let formattedText = "";
			try {
				formattedText = await formatNoteWithPerplexity(ocrText);
			} catch (formatError) {
				console.error("Perplexity formatting failed:", formatError);
				formattedText = "";
			}

			const content = formattedText || ocrText || req.body.content || "";

			const noteData = {
				patientId: req.body.patientId,
				patientName: req.body.patientName,
				noteType: req.body.noteType,
				title: req.body.title,
				content,
			};

			if (!noteData.patientId || !noteData.title) {
				return res.status(400).json({ error: "Missing required fields" });
			}

			const result = await NoteService.create(noteData as Note);
			clearNotesCache();
			return res.json(result);
		} catch (error) {
			console.error("Error in upload:", error);
			return res.status(500).json({ error: `Failed: ${error}` });
		}
	},

	async update(req: Request, res: Response) {
		const { createdAt, updatedAt, ...rest } = req.body;
		const result = await NoteService.update(req.params.id, rest);
		clearNotesCache();
		return res.json(result);
	},

	async delete(req: Request, res: Response) {
		const result = await NoteService.delete(req.params.id);
		clearNotesCache();
		return res.status(200).send(result);
	},

	async getAll(_: Request, res: Response) {
		const result = await NoteService.getAll();
		return res.json(result);
	},

	async getByPatientId(req: Request, res: Response) {
		const result = await NoteService.getByPatientId(req.params.patientId);
		return res.json(result);
	},
};
