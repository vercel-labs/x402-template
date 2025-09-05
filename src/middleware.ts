import { NextRequest, NextResponse } from "next/server";
import { paymentMiddleware } from "x402-next";
import { facilitator as coinbaseFacilitator } from "@coinbase/x402";
import { z } from "zod";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
  runtime: "nodejs",
};

const testFacilitator = {
  url: "https://x402.org/facilitator" as const,
};

const facilitator =
  process.env.NODE_ENV === "production"
    ? coinbaseFacilitator
    : coinbaseFacilitator; // testFacilitator- but it breaks things idk?

const network = process.env.NODE_ENV === "production" ? "base" : "base-sepolia";

export const x402Middleware = paymentMiddleware(
  process.env.X402_WALLET_ADDRESS as `0x${string}`,
  {
    // pages
    "/blog": {
      price: "$0.01",
      network,
      config: {
        description: "Access to protected content",
      },
    },
    // mcp tools
    [mcpTool("get_random_number")]: {
      price: "$0.01",
      network,
      config: {
        description: "Access to protected content",
      },
    },
    // api routes
    "/api/math/get-random-number": {
      price: "$0.05",
      network,
      config: {
        description: "Access to protected content",
      },
    },
    "/api/math/add": {
      price: "$0.10",
      network,
      config: {
        description: "Access to protected content",
      },
    },
  },
  facilitator
);

function mcpTool(name: string) {
  return `/__mcp/tool/${name}`;
}

const mcpToolCallSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.number(),
  method: z.literal("tools/call"),
  params: z.object({
    name: z.string(),
    arguments: z.record(z.string(), z.unknown()),
  }),
});

export const x402McpMiddleware = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const {
      params: { name },
    } = mcpToolCallSchema.parse(body);

    req.nextUrl.pathname = `/__mcp/tool/${name}`;
    return x402Middleware(req);
  } catch (error) {
    return NextResponse.next();
  }
};

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/mcp") {
    return x402McpMiddleware(request);
  } else if (request.nextUrl.pathname.startsWith("/api")) {
    return x402Middleware(request);
  } else {
    const isScraper = checkIsScraper(request);
    if (isScraper) {
      return x402Middleware(request);
    } else {
      return NextResponse.next();
    }
  }
}

function checkIsScraper(request: NextRequest) {
  const scraperRegex =
    /AI2Bot|Ai2Bot-Dolma|aiHitBot|Amazonbot|anthropic-ai|Applebot|Applebot-Extended|Brightbot 1.0|Bytespider|CCBot|ChatGPT-User|Claude-Web|ClaudeBot|cohere-ai|cohere-training-data-crawler|Cotoyogi|Crawlspace|Diffbot|DuckAssistBot|FacebookBot|Factset_spyderbot|FirecrawlAgent|FriendlyCrawler|Google-Extended|GoogleOther|GoogleOther-Image|GoogleOther-Video|GPTBot|iaskspider\/2.0|ICC-Crawler|ImagesiftBot|img2dataset|ISSCyberRiskCrawler|Kangaroo Bot|meta-externalagent|Meta-ExternalAgent|meta-externalfetcher|Meta-ExternalFetcher|NovaAct|OAI-SearchBot|omgili|omgilibot|Operator|PanguBot|Perplexity-User|PerplexityBot|PetalBot|Scrapy|SemrushBot-OCOB|SemrushBot-SWA|Sidetrade indexer bot|TikTokSpider|Timpibot|VelenPublicWebCrawler|Webzio-Extended|YouBot/i;

  const userAgent = request.headers.get("user-agent");

  const botUserAgent = scraperRegex.test(userAgent ?? "");
  const manualBot = request.nextUrl.searchParams.get("bot") === "true";

  return botUserAgent || manualBot;
}
