import { getRandomNumber, getRandomNumberSchema } from "@/lib/math";
import { NextResponse } from "next/server";

export type Response = {
  randomNumber: number;
};

export const POST = async (request: Request) => {
  const args = getRandomNumberSchema.parse(await request.json());
  return NextResponse.json<Response>({
    randomNumber: getRandomNumber(args),
  });
};
