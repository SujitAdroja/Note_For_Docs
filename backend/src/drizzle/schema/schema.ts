import {
	pgTable,
	uuid,
	varchar,
	text,
	timestamp,
	date,
	pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const genderEnum = pgEnum("gender", [
	"male",
	"female",
	"other",
	"unknown",
]);
export const noteTypeEnum = pgEnum("note_type", ["typed", "scanned"]);

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const patients = pgTable("patients", {
	id: uuid("id").defaultRandom().primaryKey(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	lastName: varchar("last_name", { length: 100 }).notNull(),
	dob: date("dob").notNull(),
	gender: genderEnum("gender").notNull().default("unknown"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type Patient = typeof patients.$inferSelect;

export const notes = pgTable("notes", {
	id: uuid("id").defaultRandom().primaryKey(),
	patientId: uuid("patient_id")
		.notNull()
		.references(() => patients.id, { onDelete: "cascade" }),
	patientName: varchar("patient_name", { length: 100 }),
	noteType: noteTypeEnum("note_type").notNull(),
	title: varchar("title", { length: 100 }).notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Note = typeof notes.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
	notes: many(notes),
}));

export const patientsRelations = relations(patients, ({ many }) => ({
	notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one }) => ({
	patient: one(patients, {
		fields: [notes.patientId],
		references: [patients.id],
	}),
}));
