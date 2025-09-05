import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";

export const maxDuration = 30;

import { account } from "@/lib/account";
import { StreamableHTTPClientTransport } from "@/lib/mcp/http-transport";
import { createMCPClient } from "@/lib/mcp/client";

const url = new URL(
  "/mcp",
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"
);

export const POST = async (request: Request) => {
  const {
    messages,
    model,
    paymentEnabled,
  }: { messages: UIMessage[]; model: string; paymentEnabled: boolean } =
    await request.json();

  const transport = new StreamableHTTPClientTransport(url, {
    x402Configuration: paymentEnabled
      ? {
          walletClient: account,
          maxPaymentValue: BigInt(0.1 * 10 ** 6), // 0.10 USDC
        }
      : undefined,
  });

  const mcpClient = await createMCPClient({
    transport,
  });
  const tools = await mcpClient.tools();

  const result = streamText({
    model,
    tools,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(10),
    system: `
      You are a helpful assistant.
      Note that some tools may be using the new "x402" protocol. This protocol uses the long reserved 402 status code to indicate that a tool requires payment to be used.
      The user has an option to enable payments. There is nothing you need to do to process payments, if they are enabled, tool calls will work as normal.
    `,
    onFinish: async () => {
      await mcpClient.close();
    },
  });
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
};
