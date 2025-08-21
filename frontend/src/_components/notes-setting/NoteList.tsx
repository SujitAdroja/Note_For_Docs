"use client";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import type { Note, Patient } from "@b/drizzle/schema/schema";
import NoteModal from "./NoteModel";
import NoteCard from "./NotesCard";
import { getLightBgAndShadowForPatient } from "@f/utils/color-mapper";
import { Button } from "@f/components/ui/button";
import { LoadingState } from "@f/app/n4d/notes/page";

interface NoteListProps {
	notes: Note[];
	patients: Patient[];
	onUpdate: (id: string, note: Note) => Promise<boolean>;
	onDelete: (id: string) => void;
	pagination: { page: number; limit: number; total: number };
	onPrevPage: () => void;
	onNextPage: () => void;
	loading: LoadingState;
}

const NoteList = (props: NoteListProps) => {
	const [note, setNote] = useState<Note | null>(null);
	const { page, limit, total } = props.pagination;

	const handleUpdate = async (updatedNote: Note) => {
		if (note && note.id) {
			const success = await props.onUpdate(note.id, updatedNote);
			if (success) {
				setNote(null);
			}
		}
	};

	return (
		<div className="container mx-auto py-3">
			<section className="mb-6">
				{props.loading === "fetchNotes" && (
					<div className="flex justify-center items-center min-h-[40vh]">
						<Loader2 className="w-8 h-8 animate-spin text-black" />
					</div>
				)}

				{/* Empty state */}
				{!props.loading && props.pagination.total === 0 && (
					<div className="flex justify-center items-center min-h-[40vh]">
						<div className="text-center">
							<div className="text-gray-400 text-lg font-semibold">
								:) No notes found
							</div>
						</div>
					</div>
				)}

				{/* Notes list */}
				{props.loading !== "fetchNotes" && props.pagination.total > 0 && (
					<div className="py-3 masonry-container">
						{props.notes.map((note) => {
							const patient = props.patients.find(
								(p) => p.id === note.patientId,
							);
							const bgColorClass = patient
								? getLightBgAndShadowForPatient(patient.id)
								: {
										bgColorClass: "bg-white",
										shadowClass: "hover:shadow-[8px_8px_0px_rgba(0,0,0,0.1)]",
										darkBgClass: "text-black",
										darkBorderClass: "border-black",
									};

							return (
								<NoteCard
									key={note.id}
									note={note}
									bgColorClass={bgColorClass}
									onEdit={() => setNote(note)}
									onDelete={props.onDelete}
								/>
							);
						})}
					</div>
				)}
			</section>

			{props.notes?.length > 0 && (
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="text-muted-foreground flex-1 text-sm">
						Page {page} of {Math.ceil(total / limit)}
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={props.onPrevPage}
						disabled={page === 1}
					>
						{props.loading === "fetchPrevNotes" ? (
							<Loader2 className="w-4 h-4 animate-spin text-black" />
						) : (
							<ChevronLeft className="h-4 w-4" />
						)}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={props.onNextPage}
						disabled={page * limit >= total}
					>
						{props.loading === "fetchNextNotes" ? (
							<Loader2 className="w-4 h-4 animate-spin text-black" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</Button>
				</div>
			)}

			{note && props.patients && (
				<NoteModal
					note={note}
					patients={props.patients}
					onUpdate={handleUpdate}
					onCancel={() => setNote(null)}
					loading={props.loading === "saving"}
				/>
			)}
		</div>
	);
};

export default NoteList;
