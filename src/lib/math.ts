import { z } from "zod";

export const getRandomNumberSchemaFields = {
  min: z.number().int().min(0),
  max: z.number().int().min(1),
};

export const getRandomNumberSchema = z.object(getRandomNumberSchemaFields);

export function getRandomNumber(input: z.infer<typeof getRandomNumberSchema>) {
  return Math.floor(Math.random() * (input.max - input.min + 1)) + input.min;
}

export const addSchemaFields = {
  a: z.number().int(),
  b: z.number().int(),
};

export const addSchema = z.object(addSchemaFields);

export function add(input: z.infer<typeof addSchema>) {
  return input.a + input.b;
}
