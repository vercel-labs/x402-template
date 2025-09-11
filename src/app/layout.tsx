import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "x402 AI Starter Kit",
  description:
    "A demo of agentic payments powered by x402 using Next.js, AI SDK, AI Elements, AI Gateway, and the Coinbase CDP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <div className="size-full flex flex-col">
          <header className={`${geistSans.className} border-b border-black`}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 text-2xl font-bold">
                <Link
                  href="https://github.com/vercel-labs/x402-ai-starter"
                  className="underline"
                >
                  <h1>x402 AI Starter Kit</h1>
                </Link>{" "}
                -
                <h2>
                  powered by:{" "}
                  <Link href="https://nextjs.org" className="underline">
                    Next.js
                  </Link>
                  ,{" "}
                  <Link href="https://ai-sdk.dev" className="underline">
                    AI SDK
                  </Link>
                  ,{" "}
                  <Link
                    href="https://vercel.com/ai-gateway"
                    className="underline"
                  >
                    AI Gateway
                  </Link>
                  ,{" "}
                  <Link
                    href="https://ai-sdk.dev/elements/overview"
                    className="underline"
                  >
                    AI Elements
                  </Link>
                  , and the{" "}
                  <Link
                    href="https://docs.cdp.coinbase.com/"
                    className="underline"
                  >
                    Coinbase CDP
                  </Link>
                </h2>
              </div>
              <div className="flex flex-row gap-2">
                <Link href="/" className="underline">
                  Chat with paid remote MCP tools
                </Link>
                <Link href="/playground" className="underline">
                  Paid API playground
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
