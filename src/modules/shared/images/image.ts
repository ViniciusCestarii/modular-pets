import { index, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { sharedPgSchema } from "../drizzle";

export const imagesTable = sharedPgSchema.table(
  "images",
  {
    id: uuid().primaryKey().$defaultFn(v7),
    src: varchar().notNull(),
    // polymorphic relationships
    ownerId: uuid().notNull(),
    ownerType: varchar({ length: 50 }).notNull(), // e.g. 'pet', 'product'
  },
  (table) => [index("ownerId_idx").on(table.ownerId)],
);
