import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["ACTIVE", "INACTIVE", "ADOPTED"]);
