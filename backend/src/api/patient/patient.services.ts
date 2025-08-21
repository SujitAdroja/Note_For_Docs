import { eq, sql } from "drizzle-orm";
import { db } from "../../drizzle/db";
import { Patient, patients } from "../../drizzle/schema/schema";

export const PatientService = {
	async getAll() {
		return db.select().from(patients);
	},
	async getAllWithPagination(_: number, limit: number, offset: number) {
		const totalResult = await db
			.select({ count: sql`count(*)` })
			.from(patients);
		const total = Number(totalResult[0]?.count ?? 0);
		const data = await db.select().from(patients).limit(limit).offset(offset);
		return { data, total };
	},
	async getById(id: string) {
		return db.select().from(patients).where(eq(patients.id, id));
	},
	async create(data: Patient) {
		return db.insert(patients).values(data).returning();
	},
	async update(id: string, data: Partial<Patient>) {
		return db.update(patients).set(data).where(eq(patients.id, id)).returning();
	},
	async delete(id: string) {
		return db.delete(patients).where(eq(patients.id, id)).returning();
	},
};
