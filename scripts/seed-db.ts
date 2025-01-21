import { seed } from "drizzle-seed";
import * as schemas from "@/db/schema";
import db from "@/db";

await seed(db, schemas, { count: 100 });

console.log("Database seeded successfully");
