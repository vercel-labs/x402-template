import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from "ai";

export const maxDuration = 30;

import { addSchema, getRandomNumberSchema } from "@/lib/math";
import { makeApiClient } from "@/lib/axios";
import { Response as RandomNumberResponse } from "@/app/api/math/get-random-number/route";
import { Response as AddResponse } from "@/app/api/math/add/route";

export const POST = async (request: Request) => {
  const {
    messages,
    model,
    paymentEnabled,
  }: { messages: UIMessage[]; model: string; paymentEnabled: boolean } =
    await request.json();

  const api = makeApiClient({
    enablePayment: paymentEnabled,
  });

  const result = streamText({
    model,
    tools: {
      getRandomNumber: tool({
        description: "Get a random number between two numbers",
        inputSchema: getRandomNumberSchema,
        execute: async ({ min, max }) => {
          const {
            data: { randomNumber },
          } = await api.post<RandomNumberResponse>(
            "/api/math/get-random-number",
            { min, max }
          );
          return randomNumber;
        },
      }),
      add: tool({
        description: "Add two numbers",
        inputSchema: addSchema,
        execute: async ({ a, b }) => {
          const {
            data: { result },
          } = await api.post<AddResponse>("/api/math/add", { a, b });
          return result;
        },
      }),
    },
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: `
      You are a helpful assistant.
      Note that some tools may be using the new "x402" protocol. This protocol uses the long reserved 402 status code to indicate that a tool requires payment to be used.
      The user has an option to enable payments. There is nothing you need to do to process payments, if they are enabled, tool calls will work as normal.
    `,
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
};
