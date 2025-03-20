import { createSelectSchema } from "drizzle-typebox";
import { imagesTable } from "./image";
import { t } from "elysia";

// just for swagger
export const swaggerImageSchema = createSelectSchema(imagesTable);

export const swaggerViewImageSchema = t.Object({
  id: swaggerImageSchema.properties.id,
  src: swaggerImageSchema.properties.src,
});
