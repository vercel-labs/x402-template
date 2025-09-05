// https://github.com/vercel/ai/blob/8aadbc90435f2c66abd4ebb764810b0ce69ea127/packages/ai/src/error/mcp-client-error.ts
import { AISDKError } from "@ai-sdk/provider";

const name = "AI_MCPClientError";
const marker = `vercel.ai.error.${name}`;
const symbol = Symbol.for(marker);

/**
 * An error occurred with the MCP client.
 */
export class MCPClientError extends AISDKError {
  private readonly [symbol] = true;

  constructor({
    name = "MCPClientError",
    message,
    cause,
  }: {
    name?: string;
    message: string;
    cause?: unknown;
  }) {
    super({ name, message, cause });
  }

  static isInstance(error: unknown): error is MCPClientError {
    return AISDKError.hasMarker(error, marker);
  }
}
