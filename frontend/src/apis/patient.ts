import type { Patient } from "@b/drizzle/schema/schema";
import { PatientSchemaType } from "@f/_components/patient-settings/PatientForm";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPatients() {
	const res = await fetch(`${API_URL}/patients`);
	if (!res.ok) {
		toast.error("Failed to fetch patients");
		throw new Error("Failed to fetch patients");
	}
	return res.json();
}

export async function fetchPatientsWithPagination(
	page = 1,
	limit = 10,
): Promise<{ data: Patient[]; total: number }> {
	const res = await fetch(
		`${API_URL}/patients/paginated?page=${page}&limit=${limit}`,
	);
	if (!res.ok) throw new Error("Failed to fetch notes");
	return res.json();
}

export async function addPatient(patient: PatientSchemaType) {
	const res = await fetch(`${API_URL}/patients`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(patient),
	});
	if (!res.ok) throw new Error("Failed to add patient");
	return res.json();
}

export async function updatePatient(id: string, patient: PatientSchemaType) {
	const res = await fetch(`${API_URL}/patients/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(patient),
	});
	if (!res.ok) throw new Error("Failed to update patient");
	return res.json();
}

export async function deletePatient(id: string) {
	const res = await fetch(`${API_URL}/patients/${id}`, {
		method: "DELETE",
	});
	if (!res.ok) throw new Error("Failed to delete patient");
}
