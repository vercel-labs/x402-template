import { env } from "@/lib/env";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { wrapFetchWithPayment } from "x402-fetch";
import { chain, getOrCreatePurchaserAccount } from "@/lib/accounts";
import { createWalletClient, http } from "viem";

type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

const account = await getOrCreatePurchaserAccount();
const walletClient = createWalletClient({
  chain,
  transport: http(),
  account,
});

export async function POST(request: NextRequest) {
  const enablePayment = request.headers.get("enable-payment") === "true";
  const isBot = request.headers.get("user-agent")?.includes("bot") ?? false;
  const job = request.nextUrl.searchParams.get("job");

  const loggedFetch = makeLoggedFetch(console.log);
  const fetch = enablePayment
    ? wrapFetchWithPayment(loggedFetch, walletClient as any) // TODO: fix type
    : loggedFetch;

  console.log("initiating job", job);
  if (job === "scrape") {
    const result = await scrapeJob(fetch, isBot);
    console.log("result", JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } else if (job === "math") {
    const result = await mathJob(fetch);
    console.log("result", JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } else {
    return new Response("Invalid job", { status: 400 });
  }
}

function makeLoggedFetch(
  log: (...args: unknown[]) => void
): typeof globalThis.fetch {
  return async (...args) => {
    log("Request: ", args[1]?.method ?? "GET", args[0].toString());
    log("Request Headers: ", JSON.stringify(args[1]?.headers ?? {}, null, 2));
    const rawResponse = await fetch(...args);
    const clonedResponse = rawResponse.clone();
    log(
      "Response: ",
      args[1]?.method ?? "GET",
      args[0].toString(),
      clonedResponse.status,
      clonedResponse.statusText
    );
    log("Response Headers: ", JSON.stringify(clonedResponse.headers, null, 2));
    const body = await clonedResponse.text();
    try {
      const json = JSON.parse(body);
      log("Response Body: ", JSON.stringify(json, null, 2));
    } catch (error) {
      log("Response Body: ", JSON.stringify(body, null, 2));
    }
    return rawResponse;
  };
}

async function scrapeJob(fetch: Fetch, isBot: boolean) {
  const response = await fetch(`${env.URL}/blog`, {
    headers: {
      ...(isBot ? { "user-agent": "Bot" } : {}),
    },
  });

  if (!response.ok) {
    return new Response("An error occurred", { status: 500 });
  }

  const blogData = await response.text();

  const $ = cheerio.load(blogData);
  const blogTitles = $("h2")
    .map((_, el) => $(el).text().trim())
    .get();

  return { blogTitles };
}

async function mathJob(fetch: Fetch) {
  const response = await fetch(`${env.URL}/api/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      a: 1,
      b: 2,
    }),
  });

  if (!response.ok) {
    return new Response("An error occurred", { status: 500 });
  }

  const result = await response.json();

  return { result };
}
