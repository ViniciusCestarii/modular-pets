import { Static } from "elysia";
import { createPetSchema, listPetsSchema } from "./schema";
import { InferSelectModel } from "drizzle-orm";
import { petsTable } from "./pet";
import { ImageView } from "@/modules/shared/images/types";
import { Breed } from "../breeds/types";
import { Specie } from "../species/types";

export type Pet = InferSelectModel<typeof petsTable>;

export type PetView = Pet & {
  images: ImageView[];
  breed: Breed | null;
  specie: Specie | null;
};

export type PetList = {
  pets: PetView[];
  total: number;
};

export type ListPets = Static<typeof listPetsSchema>;

export type CreatePet = Static<typeof createPetSchema>;
