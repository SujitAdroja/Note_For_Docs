"use client";

import Image from "next/image";
import { useState } from "react";
import {
	ArrowUpFromLine,
	Check,
	ChevronDown,
	ClipboardMinus,
	ListFilter,
	Loader2,
	Search,
	Trash,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Note, Patient } from "@b/drizzle/schema/schema";
import { Button } from "@f/components/ui/button";
import { Input } from "@f/components/ui/input";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { formatFileSize } from "@f/utils/helper";
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
import { cn } from "@f/lib/utils";

export const noteSchema = z
	.object({
		patientId: z.string().min(3, "Please select a patient"),
		patientName: z.string().optional(),
		noteType: z.enum(["typed", "scanned"]),
		title: z
			.string()
			.min(3, "Title must be ≥ 3 characters")
			.max(40, "First name must be ≤ 20 characters"),
		content: z.string().optional(),
	})
	.refine(
		(data) =>
			data.noteType === "scanned" || (data.content && data.content.length >= 3),
		{
			message:
				"Content is required and must be at least 3 characters for typed notes",
			path: ["content"],
		},
	);

export type NoteForm = z.infer<typeof noteSchema>;

interface NoteInputProps {
	patients: Patient[];
	onAdd: (note: Note & { file: File }) => Promise<boolean>;
	loading: boolean;
	searchTerm: string;
	setSearchTerm: (term: string) => void;
}

const NoteInput = ({
	patients,
	onAdd,
	loading,
	setSearchTerm,
	searchTerm,
}: NoteInputProps) => {
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [open, setOpen] = useState(false);
	const [showFilter, setShowFilter] = useState(false);

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
			patientId: "",
			patientName: "",
			noteType: undefined,
			title: "",
			content: "",
		},
	});

	const noteType = watch("noteType");
	const patientId = watch("patientId");
	const saveNote = async (data: NoteForm) => {
		const patient = patients.find((p) => p.id === data.patientId);
		const attachFile = {
			...data,
			file: uploadedFile,
			patientName: patient?.firstName + " " + patient?.lastName,
		} as Note & { file: File };
		const success = await onAdd(attachFile);
		if (success) {
			clearNote();
		}
	};

	const clearNote = () => {
		setValue("noteType", "typed");
		setUploadedFile(null);
		setShowFilter(false);
		reset();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		console.log(file);
		if (file) {
			setUploadedFile(file);
			setValue("noteType", "scanned");
		}
	};

	return (
		<div className="flex gap-4 items-center w-full lg:w-4/6">
			<div
				className={cn(
					"w-full px-4 py-3 border-2 border-black rounded-lg bg-white relative shadow-[3px_3px_0px_rgba(0,0,0,1)]",
					!noteType ? "z-1" : "z-3",
				)}
			>
				{!noteType && !showFilter && (
					<div className="w-full flex justify-between items-center">
						<span
							className="text-gray-400 w-full cursor-text"
							onClick={() => setValue("noteType", "typed")}
						>
							Take a note...
						</span>
						<div className="flex gap-2 items-center">
							<label className="cursor-pointer">
								<div className="flex gap-1 items-center focus:outline-none hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
									<ArrowUpFromLine width={18} height={18} />
									<span className="font-semibold">Upload</span>
								</div>
								<Input
									type="file"
									variant="primary"
									onChange={handleFileChange}
									accept="image/*,application/pdf"
									className="hidden"
								/>
							</label>

							<div
								className="flex gap-1 items-center focus:outline-none hover:bg-gray-100 p-2 cursor-pointer rounded-lg"
								onClick={() =>
									!searchTerm.trim()
										? setShowFilter(!showFilter)
										: setSearchTerm("")
								}
							>
								<ListFilter width={18} height={18} />
								<span className="font-semibold">
									{searchTerm ? "Clear" : "Filter"}
								</span>
							</div>
						</div>
					</div>
				)}

				{noteType && (
					<form
						onSubmit={handleSubmit(saveNote)}
						className="flex flex-col gap-2"
					>
						{noteType === "scanned" &&
							uploadedFile?.type.startsWith("image") && (
								<div className="flex justify-center items-center">
									<Image
										src={URL.createObjectURL(uploadedFile)}
										alt="uploaded-file"
										width={200}
										height={200}
									/>
								</div>
							)}
						{noteType === "scanned" && uploadedFile?.type.includes("pdf") && (
							<div className="flex justify-between items-center border-2 rounded-lg px-4 py-2">
								<div className="flex gap-2 items-center">
									<ClipboardMinus width={24} height={24} />
									<div className="flex flex-col gap-2">
										<div className="flex flex-col">
											<span className="font-semibold text-sm">
												{uploadedFile?.name}
											</span>
											<span className="text-gray-600 text-xs">
												{formatFileSize(Number(uploadedFile?.size))}
											</span>
										</div>
									</div>
								</div>
								<Trash
									width={18}
									height={18}
									cursor="pointer"
									onClick={clearNote}
								/>
							</div>
						)}

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

						{noteType === "typed" && (
							<div data-color-mode="light">
								<MDEditor
									textareaProps={{
										placeholder: "Take a note...",
									}}
									value={watch("content")}
									preview="edit"
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
						)}

						<div className="flex gap-2 justify-end mt-2">
							<Button variant="secondary" onClick={clearNote} type="button">
								Clear
							</Button>
							<Button type="submit" variant="primary" disabled={loading}>
								{loading ? (
									<Loader2 className="w-4 h-4 animate-spin text-black" />
								) : (
									<span>Save</span>
								)}
							</Button>
						</div>
					</form>
				)}
				{showFilter && (
					<div className="flex flex-col">
						<div className="relative w-1/3 mb-2">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4" />
							<Input
								className="w-full p-4 pl-10 rounded-lg border-none"
								placeholder="Search notes..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								autoFocus
							/>
						</div>
						<div className="flex gap-2 justify-end mt-2">
							<Button
								variant="primary"
								onClick={() => {
									clearNote();
									setSearchTerm("");
								}}
								type="button"
							>
								Clear
							</Button>
						</div>
					</div>
				)}
			</div>

			{(noteType || showFilter) && (
				<div
					className="fixed inset-0 z-0"
					onClick={clearNote}
					aria-hidden="true"
				/>
			)}
		</div>
	);
};

export default NoteInput;
