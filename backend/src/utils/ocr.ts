import PdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import { fromBuffer } from "pdf2pic";
import { Options } from "pdf2pic/dist/types/options";

const options: Options = {
	density: 100,
	saveFilename: "output",
	savePath: "./images",
	format: "png",
	width: 800,
	height: 600,
};

export const extractTextFromImageBuffer = async (buffer: Buffer) => {
	const result = await Tesseract.recognize(buffer, "eng", { logger: () => {} });
	return result.data.text.trim();
};

export const extractTextFromPdfBuffer = async (pdfBuffer: Buffer) => {
	try {
		const data = await PdfParse(pdfBuffer);
		return data.text;
	} catch (error) {
		console.error("Error parsing PDF:", error);
		return "";
	}
};

export const extractTextFromPdfBufferWithOcrFallback = async (
	pdfBuffer: Buffer,
) => {
	try {
		const data = await PdfParse(pdfBuffer);
		if (data.text.trim()) return data.text.trim();
	} catch (err) {
		console.warn("pdf-parse failed, fallback to OCR");
	}

	const convert = fromBuffer(pdfBuffer, options);
	const result = await convert(1, { responseType: "buffer" });
	if (!result.buffer || result.buffer.length === 0) {
		console.error("Empty or invalid image buffer returned from pdf2pic");
		throw new Error("Failed to extract text from PDF");
	}

	const text = await extractTextFromImageBuffer(result.buffer);
	return text;
};
