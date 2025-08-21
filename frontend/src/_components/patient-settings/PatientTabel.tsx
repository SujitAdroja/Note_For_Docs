"use client";

import React from "react";
import type { Patient } from "@b/drizzle/schema/schema";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@f/components/ui/table";
import { Input } from "@f/components/ui/input";
import { Button } from "@f/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { usePatientColumns } from "./PatientColunms";
import { LoadingState } from "@f/app/n4d/patients/page";

interface Props {
	patients: Patient[];
	showDialog: () => void;
	showEditDialog: (patient: Patient) => void;
	deletePatient: (id: string) => void;
	pagination: { page: number; limit: number; total: number };
	onPrevPage: () => void;
	onNextPage: () => void;
	loading: LoadingState;
}

export default function PatientTable({
	patients,
	showDialog,
	showEditDialog,
	deletePatient,
	pagination,
	onPrevPage,
	onNextPage,
	loading,
}: Props) {
	const { page, limit, total } = pagination;

	const columns = usePatientColumns(showEditDialog, deletePatient);

	const table = useReactTable({
		data: patients,
		columns,
		getRowId: (row) => row.id,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<>
			<div className="flex items-center justify-between py-4">
				<h1 className="text-2xl font-bold">Patients</h1>
				<div className="flex gap-4">
					<Input
						variant="default"
						placeholder="Filter patients by name..."
						value={
							(table.getColumn("firstName")?.getFilterValue() as string) ?? ""
						}
						onChange={(e) =>
							table.getColumn("firstName")?.setFilterValue(e.target.value)
						}
						className="max-w-sm"
					/>
					<Button
						variant="secondary"
						className="border-2"
						onClick={showDialog}
						disabled={loading === "save"}
					>
						Add Patient
					</Button>
				</div>
			</div>

			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{loading === "fetch" ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<div className="flex justify-center items-center">
										<Loader2 className="w-8 h-8 animate-spin text-black" />
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									:) No patients found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<div className="flex items-center justify-end space-x-2 py-4">
				<span className="text-sm text-muted-foreground flex-1">
					Page {page} of {Math.ceil(total / limit)}
				</span>
				<div className="flex items-center justify-end space-x-2 py-4">
					<span className="text-sm text-muted-foreground flex-1">
						Page {page} of {Math.ceil(total / limit)}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={onPrevPage}
						disabled={page === 1 || loading === "fetch"}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onNextPage}
						disabled={page * limit >= total || loading === "fetch"}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</>
	);
}
