import { InferSelectModel } from "drizzle-orm";
import { imagesTable } from "./image";

export type Image = InferSelectModel<typeof imagesTable>;

export type ImageView = Pick<Image, "id" | "src">;

export type Owner = Pick<Image, "ownerId" | "ownerType">;
