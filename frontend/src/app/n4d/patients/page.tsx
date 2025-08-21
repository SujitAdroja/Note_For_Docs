"use client";

import type { Patient } from "@b/drizzle/schema/schema";
import withAuth from "@f/_components/base/WithAuth";
import PatientFormDialog, {
	PatientSchemaType,
} from "@f/_components/patient-settings/PatientForm";
import PatientTable from "@f/_components/patient-settings/PatientTabel";
import {
	addPatient,
	updatePatient,
	deletePatient,
	fetchPatientsWithPagination,
} from "@f/apis/patient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export type LoadingState = null | "fetch" | "save";

const PatientsTable = () => {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [row, setRow] = useState<Patient | null>(null);
	const [showDialog, setShowDialog] = useState(false);
	const [loading, setLoading] = useState<LoadingState>("fetch");
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
	});

	useEffect(() => {
		async function loadPatients() {
			setLoading("fetch");
			try {
				const { data, total } = await fetchPatientsWithPagination(
					pagination.page,
					pagination.limit,
				);
				setPatients(data);
				setPagination((p) => ({ ...p, total }));
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(null);
			}
		}

		loadPatients();
	}, [pagination.page, pagination.limit]);

	const handleSave = async (updated: PatientSchemaType & { id?: string }) => {
		setLoading("save");
		try {
			if (updated.id) {
				const [data] = await updatePatient(updated.id, updated);
				setPatients((prev) =>
					prev.map((p) => (p.id === updated.id ? data : p)),
				);
				toast.success("Patient updated successfully");
			} else {
				await addPatient(updated);
				const { page, limit } = pagination;
				const { data, total } = await fetchPatientsWithPagination(page, limit);
				setPatients(data);
				setPagination((p) => ({ ...p, total }));
				toast.success("Patient added successfully");
			}
			setShowDialog(false);
			setRow(null);
		} catch (err) {
			toast.error(`Failed to ${updated.id ? "update" : "add"}: \n${err}`);
		} finally {
			setLoading(null);
		}
	};

	const handleDelete = async (id: string) => {
		setLoading("save");
		try {
			await deletePatient(id);
			const { page, limit } = pagination;
			const { data, total } = await fetchPatientsWithPagination(page, limit);
			setPatients(data);
			setPagination((p) => ({ ...p, total }));
			toast.success("Patient deleted successfully");
		} catch (err) {
			toast.error(`Failed Delete: \n${err}`);
		} finally {
			setLoading(null);
		}
	};

	const prevPage = () => {
		setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }));
	};
	const nextPage = () => {
		setPagination((p) => ({
			...p,
			page: p.page * p.limit < p.total ? p.page + 1 : p.page,
		}));
	};

	return (
		<div className="w-full">
			<div className="container mx-auto px-4 md:px-8 py-3">
				<PatientTable
					patients={patients}
					showEditDialog={(p) => {
						setRow(p);
						setShowDialog(true);
					}}
					deletePatient={handleDelete}
					showDialog={() => setShowDialog(true)}
					pagination={pagination}
					onPrevPage={prevPage}
					onNextPage={nextPage}
					loading={loading}
				/>
			</div>

			{showDialog && (
				<PatientFormDialog
					open
					mode={row ? "edit" : "create"}
					patient={row ?? undefined}
					onSubmit={(data) => handleSave({ ...data, id: row?.id })}
					onCancel={() => {
						setShowDialog(false);
						setRow(null);
					}}
					OpenChange={() => {
						setShowDialog(false);
						setRow(null);
					}}
					loading={loading}
				/>
			)}
		</div>
	);
};

export default withAuth(PatientsTable);
