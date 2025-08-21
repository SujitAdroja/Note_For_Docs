"use client";

import type { Patient } from "@b/drizzle/schema/schema";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@f/components/ui/dropdown-menu";
import { Button } from "@f/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { redirect } from "next/navigation";

interface Props {
	patient: Patient;
	onEdit: (p: Patient) => void;
	onDelete: (id: string) => void;
}

export default function PatientActionsMenu({
	patient,
	onEdit,
	onDelete,
}: Props) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => onEdit(patient)}>
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onDelete(patient.id)}>
					Delete
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => redirect(`/n4d/notes`)}>
					Add Notes
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
