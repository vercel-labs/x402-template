import { addSchema, add } from "@/lib/math";
import { NextResponse } from "next/server";

export type Response = {
  result: number;
};

export const POST = async (request: Request) => {
  const args = addSchema.parse(await request.json());
  return NextResponse.json<Response>({
    result: add(args),
  });
};
