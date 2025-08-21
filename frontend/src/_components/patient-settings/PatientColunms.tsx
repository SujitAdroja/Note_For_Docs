"use client";

import { format } from "date-fns";
import type { Patient } from "@b/drizzle/schema/schema";
import { Button } from "@f/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import PatientActionsMenu from "./PatientMenu";

export function usePatientColumns(
	showEditDialog: (p: Patient) => void,
	deletePatient: (id: string) => void,
): ColumnDef<Patient>[] {
	return React.useMemo(
		() => [
			{
				accessorKey: "firstName",
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						First Name <ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ getValue }) => (
					<span className="capitalize">{getValue<string>()}</span>
				),
			},
			{
				accessorKey: "lastName",
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Last Name <ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ getValue }) => (
					<span className="capitalize">{getValue<string>()}</span>
				),
			},
			{
				accessorKey: "dob",
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						BOD <ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ getValue }) => {
					const date = getValue<string>();
					return (
						<span>{date ? format(new Date(date), "dd MMM yyyy") : "—"}</span>
					);
				},
			},
			{ accessorKey: "gender", header: "Gender" },
			{
				accessorKey: "updatedAt",
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Updated At <ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ getValue }) => {
					const date = getValue<string>();
					return (
						<span>{date ? format(new Date(date), "dd MMM yyyy") : "—"}</span>
					);
				},
			},
			{
				id: "actions",
				enableHiding: false,
				cell: ({ row }) => (
					<PatientActionsMenu
						patient={row.original}
						onEdit={showEditDialog}
						onDelete={deletePatient}
					/>
				),
			},
		],
		[showEditDialog, deletePatient],
	);
}
