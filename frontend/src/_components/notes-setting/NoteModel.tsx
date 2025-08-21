import type { Note, Patient } from "@b/drizzle/schema/schema";
import { Button } from "@f/components/ui/button";
import { useForm } from "react-hook-form";
import { NoteForm, noteSchema } from "./NoteInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@f/components/ui/label";
import { Input } from "@f/components/ui/input";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { commands } from "@uiw/react-md-editor";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@f/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@f/components/ui/popover";
import { useState } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type NoteModalProps = {
	patients: Patient[];
	note: Note;
	onUpdate: (note: Note) => void;
	onCancel: () => void;
	loading: boolean;
};

const NoteModal = ({
	patients,
	note,
	onUpdate,
	onCancel,
	loading,
}: NoteModalProps) => {
	const [open, setOpen] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<NoteForm>({
		resolver: zodResolver(noteSchema),
		defaultValues: {
			patientId: note.patientId,
			patientName: note.patientName || "",
			noteType: note.noteType,
			title: note.title,
			content: note.content,
		},
	});

	const patientId = watch("patientId");
	const updateNote = (data: NoteForm) => {
		onUpdate(data as Note);
		reset(data);
	};

	return (
		<div
			className="fixed inset-0 flex justify-center items-center z-50"
			style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
		>
			<div
				className="bg-white rounded-md p-6 max-w-xl w-full h-fit max-h-[90vh] overflow-y-auto relative"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Note</h1>
				</div>
				<form
					onSubmit={handleSubmit(updateNote)}
					className="flex flex-col gap-4"
				>
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<div>
							<Input
								type="text"
								{...register("title")}
								variant="default"
								placeholder="Title"
								autoFocus
							/>
							{errors.title && (
								<span className="text-red-600 text-xs">
									{errors.title.message}
								</span>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="patient">Patient</Label>
						<div className="w-full">
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className="justify-between hover:bg-transparent w-full"
									>
										{patientId ? (
											patients.find((p) => p.id === patientId)?.firstName +
											" " +
											patients.find((p) => p.id === patientId)?.lastName
										) : (
											<span className="text-gray-400 font-normal">
												Select a patient
											</span>
										)}
										<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="p-0">
									<Command>
										<CommandInput placeholder="Search patient..." />
										<CommandList>
											<CommandEmpty>No patient found.</CommandEmpty>
											<CommandGroup>
												{patients.map((patient) => {
													const fullName =
														patient.firstName + " " + patient.lastName;
													{
														JSON.stringify(patient);
													}
													return (
														<CommandItem
															key={patient.id}
															value={`${patient.id} ${fullName.toLowerCase()}`}
															aria-label={fullName}
															onSelect={() => {
																setValue("patientId", patient.id, {
																	shouldValidate: true,
																});
																setOpen(false);
															}}
														>
															<Check
																className={`mr-2 h-4 w-4 ${
																	patientId === patient.id
																		? "opacity-100"
																		: "opacity-0"
																}`}
															/>
															{fullName}
														</CommandItem>
													);
												})}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							{errors.patientId && (
								<span className="text-red-600 text-xs">
									{errors.patientId.message}
								</span>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<div data-color-mode="light">
							<MDEditor
								className=""
								textareaProps={{
									placeholder: "Take a note...",
								}}
								value={watch("content")}
								preview="preview"
								commands={[
									commands.bold,
									commands.italic,
									commands.strikethrough,
									commands.hr,
									commands.code,
									commands.quote,
									commands.orderedListCommand,
									commands.unorderedListCommand,
									commands.checkedListCommand,
									commands.link,
								]}
								onChange={(val) =>
									setValue("content", val || "", { shouldValidate: true })
								}
							/>
							{errors.content && (
								<span className="text-red-600 text-xs">
									{errors.content.message}
								</span>
							)}
						</div>
					</div>

					<div className="flex justify-end gap-2 mt-4">
						<Button variant="secondary" onClick={onCancel}>
							Close
						</Button>
						<Button type="submit" variant="primary" disabled={loading}>
							{loading ? (
								<Loader2 className="w-4 h-4 animate-spin text-black" />
							) : (
								<span>update</span>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default NoteModal;
