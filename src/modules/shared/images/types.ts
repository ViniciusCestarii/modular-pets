import { InferSelectModel } from "drizzle-orm";
import { imagesTable } from "./image";

export type Image = InferSelectModel<typeof imagesTable>;

export type Owner = {
  ownerId: string;
  ownerType: string;
};
