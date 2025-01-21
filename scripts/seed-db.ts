import { seedDb } from "@/modules/shared/utilities/test";

await seedDb();

console.log("Database seeded successfully");
