import db from "@/db";
import { petsTable } from "@/db/schema";
import fs from "fs";
import path from "path";

const createJSON = async () => {
  const rows = await db.select({ id: petsTable.id }).from(petsTable);

  const arrayOfRequests = rows.map((row) => `/pet/pets/${row.id}`);

  const data = JSON.stringify(arrayOfRequests);

  fs.writeFileSync(path.join(__dirname, "requests.json"), data);

  console.log("Data written to ./data/requests.json");
};

await createJSON();
