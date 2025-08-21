import { desc, eq, sql, or, ilike } from "drizzle-orm";
import { db } from "../../drizzle/db";
import { Note, notes } from "../../drizzle/schema/schema";

export const NoteService = {
	async getAll() {
		return db.select().from(notes);
	},
	async getAllWithPagination(
		_: number,
		limit: number,
		offset: number,
		filter?: string,
	) {
		const whereClause = filter
			? or(
					ilike(notes.patientName, `%${filter}%`),
					ilike(notes.title, `%${filter}%`),
					ilike(notes.content, `%${filter}%`),
				)
			: undefined;

		const totalResult = await db
			.select({ count: sql<number>`count(*)` })
			.from(notes)
			.where(whereClause ?? sql`true`);

		const total = Number(totalResult[0]?.count ?? 0);

		const data = await db
			.select()
			.from(notes)
			.where(whereClause ?? sql`true`)
			.orderBy(desc(notes.createdAt))
			.limit(limit)
			.offset(offset);

		return { data, total };
	},
	async getByPatientId(patientId: string) {
		return db.select().from(notes).where(eq(notes.patientId, patientId));
	},
	async create(data: Note) {
		return db.insert(notes).values(data).returning();
	},
	async update(id: string, data: Note) {
		return db.update(notes).set(data).where(eq(notes.id, id)).returning();
	},
	async delete(id: string) {
		return db.delete(notes).where(eq(notes.id, id)).returning();
	},
	async totalNotes() {
		return await db.select({ count: sql`count(*)` }).from(notes);
	},
};
