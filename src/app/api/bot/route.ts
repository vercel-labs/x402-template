import { NextRequest, NextResponse } from "next/server";
import { AxiosError, AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import { makeApiClient } from "@/lib/axios";
import type { Response as RandomNumberResponse } from "@/app/api/math/get-random-number/route";
import type { Response as AddResponse } from "@/app/api/math/add/route";

export async function POST(request: NextRequest) {
  const enablePayment = request.headers.get("enable-payment") === "true";
  const api = makeApiClient({
    enablePayment,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  try {
    const job = request.nextUrl.searchParams.get("job");
    if (job === "math") {
      return await handleMath(api);
    } else if (job === "blog") {
      return await handleBlog(api);
    }
    return NextResponse.json(
      { error: `Invalid job parameter: ${job}` },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          error: "Internal Axios Error",
          requestPath: error.request?.path,
          requestMethod: error.request?.method,
          requestData: error.request?.data,
          requestHeaders: error.request?.headers,
          responseStatus: error.response?.status,
          responseData: error.response?.data,
          responseHeaders: error.response?.headers,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

async function handleMath(api: AxiosInstance) {
  const {
    data: { randomNumber: randomNumberOne },
  } = await api.post<RandomNumberResponse>("/api/math/get-random-number", {
    min: 1,
    max: 100,
  });

  const {
    data: { randomNumber: randomNumberTwo },
  } = await api.post<RandomNumberResponse>("/api/math/get-random-number", {
    min: 1,
    max: 100,
  });

  const {
    data: { result: addedNumber },
  } = await api.post<AddResponse>("/api/math/add", {
    a: randomNumberOne,
    b: randomNumberTwo,
  });

  return NextResponse.json({
    randomNumberOne,
    randomNumberTwo,
    addedNumber,
  });
}

async function handleBlog(api: AxiosInstance) {
  const { data: blogData } = await api.get<string>("/blog");
  const $ = cheerio.load(blogData);
  const blogTitles = $("h2")
    .map((_, el) => $(el).text().trim())
    .get();

  return NextResponse.json({ blogTitles });
}
