import { env } from "@/lib/env";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import { wrapFetchWithPayment } from "x402-fetch";
import { chain, getOrCreatePurchaserAccount } from "@/lib/accounts";
import { createWalletClient, http } from "viem";

const account = await getOrCreatePurchaserAccount();
const walletClient = createWalletClient({
  chain,
  transport: http(),
  account,
});

export async function POST(request: Request) {
  const enablePayment = request.headers.get("enable-payment") === "true";
  const userAgent = request.headers.get("user-agent");

  const loggedFetch = makeLoggedFetch(console.log);
  const fetch = enablePayment
    ? wrapFetchWithPayment(loggedFetch, walletClient as any) // TODO: fix type
    : loggedFetch;

  const response = await fetch(`${env.URL}/blog`, {
    headers: {
      ...(userAgent ? { "user-agent": userAgent } : {}),
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

  return NextResponse.json({ blogTitles });
}

function makeLoggedFetch(log: (...args: unknown[]) => void): typeof fetch {
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
