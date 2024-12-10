import { pgEnum } from "drizzle-orm/pg-core";

export const sexEnum = pgEnum("sex", ["MALE", "FEMALE", "UNKNOWN"]);
