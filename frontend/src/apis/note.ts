import type { Note } from "@b/drizzle/schema/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchNotes(): Promise<Note[]> {
	const res = await fetch(`${API_URL}/notes`);
	if (!res.ok) throw new Error("Failed to fetch notes");
	return res.json();
}

export async function fetchNotesWithPagination(
	page = 1,
	limit = 10,
	filter?: string,
): Promise<{ data: Note[]; total: number }> {
	const res = await fetch(
		`${API_URL}/notes/?page=${page}&limit=${limit}&filter=${filter}`,
	);
	if (!res.ok) throw new Error("Failed to fetch notes");
	return res.json();
}

export async function addNote(note: Note) {
	const res = await fetch(`${API_URL}/notes`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(note),
	});
	if (!res.ok) throw new Error("Failed to add note");
	return res.json();
}

export async function uploadNote(note: Note & { file?: File }) {
	const formData = new FormData();

	formData.append("patientId", String(note.patientId || ""));
	formData.append("patientName", String(note.patientName || ""));
	formData.append("noteType", String(note.noteType));
	formData.append("title", String(note.title || ""));
	formData.append("content", String(note.content || ""));

	if (note.file instanceof File) {
		formData.append("file", note.file);
	}

	const res = await fetch(`${API_URL}/notes/upload`, {
		method: "POST",
		body: formData,
	});

	if (!res.ok) throw new Error("Failed to add note");
	return res.json();
}

export async function updateNote(id: string, note: Note) {
	const res = await fetch(`${API_URL}/notes/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(note),
	});

	if (!res.ok) throw new Error("Failed to update note");
	return res.json();
}

export async function deleteNote(id: string) {
	const res = await fetch(`${API_URL}/notes/${id}`, {
		method: "DELETE",
	});
	if (!res.ok) throw new Error("Failed to delete note");
}
