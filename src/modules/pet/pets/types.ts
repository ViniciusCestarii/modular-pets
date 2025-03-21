import { Static } from "elysia";
import { createPetSchema } from "./schema";
import { InferSelectModel } from "drizzle-orm";
import { petsTable } from "./pet";
import { ImageView } from "@/modules/shared/images/types";

export type Pet = InferSelectModel<typeof petsTable>;
export type PetView = Pet & { images: ImageView[] };

export type PetList = {
  pets: PetView[];
  total: number;
};

export type CreatePet = Static<typeof createPetSchema>;
