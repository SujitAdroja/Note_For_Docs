import type { Note } from "@b/drizzle/schema/schema";
import { cn } from "@f/lib/utils";
import { formatDate } from "date-fns";
import { Clock, NotebookPen, Trash, UserRound } from "lucide-react";

const NoteCard = ({
	note,
	onEdit,
	onDelete,
	bgColorClass,
}: {
	note: Note;
	onEdit: () => void;
	onDelete: (id: string) => void;
	bgColorClass: {
		bgColorClass: string;
		shadowClass: string;
		darkBgClass: string;
		darkBorderClass: string;
	};
}) => {
	return (
		<div
			className={cn(
				bgColorClass.shadowClass,
				bgColorClass.darkBorderClass,
				"group mb-4 break-inside-avoid border-1 rounded-lg p-4 duration-300 cursor-default z-1 relative hover:shadow-none",
			)}
			style={{ display: "inline-block", width: "100%" }}
		>
			<div className="flex flex-col gap-3">
				<div className="flex flex-col pb-2">
					<div className="flex items-center text-xs text-gray-600">
						<span className="flex items-center gap-1">
							<Clock className="w-4 h-4" />
							<span>{formatDate(new Date(note.createdAt), "dd MMM yyyy")}</span>
						</span>
					</div>
				</div>

				<div className="flex flex-col">
					<div
						className={cn("text-xl font-semibold", bgColorClass.darkBgClass)}
					>
						{note.title}
					</div>
					<p className="text-gray-700 line-clamp-3">{note.content}</p>
				</div>
				<div className="flex justify-between items-center">
					<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<button
							className="rounded-full focus:outline-none hover:bg-gray-100 p-2 cursor-pointer"
							onClick={onEdit}
							aria-label="Delete note"
						>
							<NotebookPen width={18} height={18} cursor="pointer" />
						</button>
						<button
							className="rounded-full focus:outline-none
              hover:bg-gray-100 p-2 cursor-pointer
            "
							aria-label="Delete note"
							onClick={() => onDelete(note.id)}
						>
							<Trash width={18} height={18} cursor="pointer" />
						</button>
					</div>
					<div
						className={cn(
							"flex items-center text-sm font-semibold text-gray-600",
						)}
					>
						<UserRound className="w-4 h-4 mr-1" />
						<span className="truncate max-w-full md:max-w-[5rem] lg:max-w-full overflow-hidden whitespace-nowrap">
							{note.patientName}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NoteCard;
