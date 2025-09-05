import { addSchemaFields, getRandomNumberSchemaFields } from "@/lib/math";
import { createMcpHandler } from "mcp-handler";
import { makeApiClient } from "@/lib/axios";
import type { Response as RandomNumberResponse } from "@/app/api/math/get-random-number/route";
import type { Response as AddResponse } from "@/app/api/math/add/route";

const api = makeApiClient({
  enablePayment: true,
});

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "get_random_number",
      "Get a random number between two numbers",
      {
        ...getRandomNumberSchemaFields,
      },
      async (args) => {
        const {
          data: { randomNumber },
        } = await api.post<RandomNumberResponse>(
          "/api/math/get-random-number",
          args
        );
        return {
          content: [{ type: "text", text: randomNumber.toString() }],
        };
      }
    );
    server.tool(
      "add",
      "Add two numbers",
      { ...addSchemaFields },
      async (args) => {
        const {
          data: { result },
        } = await api.post<AddResponse>("/api/math/add", args);
        return {
          content: [{ type: "text", text: result.toString() }],
        };
      }
    );
  },
  {
    serverInfo: {
      name: "test-mcp",
      version: "0.0.1",
    },
  }
);

export { handler as GET, handler as POST };
