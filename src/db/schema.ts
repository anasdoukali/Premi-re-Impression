import { boolean, integer, jsonb, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";

/** Demandes clients : contact, devis sur mesure, sélection du panier. */
export const projectRequests = pgTable("project_requests", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  kind: text("kind").notNull(), // contact | quote | cart
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  projectType: text("project_type"),
  deadline: text("deadline"),
  message: text("message").notNull(),
  productSlug: text("product_slug"),
  details: jsonb("details"),
  // Nom/poids du fichier indiqué — le fichier n'est pas transmis tant que
  // le stockage n'est pas connecté.
  attachmentName: text("attachment_name"),
  attachmentSize: integer("attachment_size"),
  status: text("status").notNull().default("nouveau"),
  handledAt: timestamp("handled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Notes internes attachées à une demande. */
export const requestNotes = pgTable("request_notes", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id")
    .notNull()
    .references(() => projectRequests.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  author: text("author").notNull().default("Équipe"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Catalogue éditable depuis l’administration. */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(), // print | textile | objets | signaletique
  kind: text("kind").notNull().default("standard"), // standard | custom
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  customization: jsonb("customization").$type<string[]>().notNull().default([]),
  imagePrimary: text("image_primary").notNull(),
  imageSecondary: text("image_secondary").notNull(),
  options: jsonb("options").$type<unknown[]>().notNull().default([]),
  /** Prix « à partir de », en centimes. `null` = aucun tarif publié. */
  priceFromCents: integer("price_from_cents"),
  priceUnit: text("price_unit").notNull().default(""),
  express: boolean("express").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Réglages du site (ligne unique, clé "site"). */
export const settings = pgTable(
  "settings",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull().default("site"),
    data: jsonb("data").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("settings_key_unique").on(t.key)],
);

export type ProjectRequestRow = typeof projectRequests.$inferSelect;
export type RequestNoteRow = typeof requestNotes.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
