"use client";

import type { Note, Patient } from "@b/drizzle/schema/schema";
import NoteList from "@f/_components/notes-setting/NoteList";
import NoteInput from "@f/_components/notes-setting/NoteInput";
import {
	addNote,
	deleteNote,
	fetchNotesWithPagination,
	updateNote,
	uploadNote,
} from "@f/apis/note";
import { fetchPatients } from "@f/apis/patient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import withAuth from "@f/_components/base/WithAuth";
import { useDebounce } from "use-debounce";

export type LoadingState =
	| null
	| "fetchPatients"
	| "fetchNotes"
	| "fetchNextNotes"
	| "fetchPrevNotes"
	| "saving"
	| "deleting";

const Notes = () => {
	const [notes, setNotes] = useState<Note[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [loading, setLoading] = useState<LoadingState>("fetchNotes");
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
	});
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch] = useDebounce(searchTerm, 500);

	useEffect(() => {
		setLoading("fetchPatients");
		fetchPatients()
			.then((res) => setPatients(res ?? []))
			.finally(() => setLoading(null));
	}, []);

	useEffect(() => {
		const { page, limit } = pagination;
		fetchNotesWithPagination(page, limit, debouncedSearch)
			.then(({ data, total }) => {
				setNotes(data);
				setPagination((prev) => ({ ...prev, total }));
			})
			.catch(console.error)
			.finally(() => setLoading(null));
	}, [pagination.page, pagination.limit, debouncedSearch]);

	const prevPage = () => {
		setLoading("fetchPrevNotes");
		setPagination((p) => ({
			...p,
			page: Math.max(1, p.page - 1),
		}));
	};

	const nextPage = () => {
		setLoading("fetchNextNotes");
		setPagination((p) => ({
			...p,
			page: p.page * p.limit < p.total ? p.page + 1 : p.page,
		}));
	};

	const fetchUpdatedNotes = async () => {
		const { page, limit } = pagination;
		const { data: updatedNotes, total } = await fetchNotesWithPagination(
			page,
			limit,
			"",
		);
		setNotes(updatedNotes);
		setPagination((prev) => ({ ...prev, total }));
	};

	const saveNote = async (note: Note & { file: File }) => {
		try {
			setLoading("saving");
			const patient = patients.find((p) => p.id === note.patientId);
			if (patient) {
				note.patientName = patient.firstName + " " + patient.lastName;
			}

			if (note.noteType === "typed") {
				await addNote(note as Note);
			} else {
				await uploadNote(note);
			}
			await fetchUpdatedNotes();
			toast.success(`Note added successfully`);
			return true;
		} catch (err) {
			toast.error(`Failed to add: \n${err}`);
			return false;
		} finally {
			setLoading(null);
		}
	};

	const editNote = async (id: string, note: Note) => {
		try {
			setLoading("saving");
			await updateNote(id, note);
			await fetchUpdatedNotes();
			toast.success("Note updated successfully");
			return true;
		} catch (err) {
			toast.error(`Failed to update: \n${err}`);
			return false;
		} finally {
			setLoading(null);
		}
	};

	const removeNote = async (id: string) => {
		try {
			setLoading("deleting");
			await deleteNote(id);
			await fetchUpdatedNotes();
			toast.success("Note deleted successfully");
		} catch (err) {
			toast.error(`Failed to delete: \n${err}`);
		} finally {
			setLoading(null);
		}
	};

	return (
		<div className="flex flex-col items-center h-screen">
			<div className="container mx-auto px-4 md:px-8 py-3">
				<div className="flex justify-center items-center mt-2 mb-4">
					<NoteInput
						patients={patients}
						onAdd={saveNote}
						loading={loading === "saving"}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>
				</div>

				<NoteList
					notes={notes}
					patients={patients}
					onUpdate={editNote}
					onDelete={removeNote}
					pagination={pagination}
					onPrevPage={prevPage}
					onNextPage={nextPage}
					loading={loading}
				/>
			</div>
		</div>
	);
};

export default withAuth(Notes);
