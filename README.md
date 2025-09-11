# x402 Next.js + AI Starter Kit

[x402](https://x402.org) is a new protocol built on top of HTTP for doing fully accountless payments easily, quickly, cheaply and securely.

This template built with [Next.js](https://nextjs.org), [AI SDK](https://ai-sdk.dev), [AI Elements](https://ai-elements.dev), and [AI Gateway](https://vercel.com/ai-gateway) and the [Coinbase CDP](https://docs.cdp.coinbase.com/) shows off using x402 with a modern AI stack.

**Demo: [https://x402-template.labs.vercel.dev/](https://x402-template.labs.vercel.dev/)**

## Features

- Remote MCP server with "paid" tools
- AI chat agent that can pay for tools
- Paywalled APIs
- Paywalled pages (for bots)
- Server managed wallets

## Tech Stack

- [Next.js](https://nextjs.org/)
- [AI SDK](https://ai-sdk.dev)
- [AI Elements](https://ai-elements.dev)
- [AI Gateway](https://vercel.com/ai-gateway)
- [Coinbase CDP](https://docs.cdp.coinbase.com/)
- [x402](https://x402.org)

## Getting Started

```bash
git clone https://github.com/vercel-labs/x402-template
cd x402-template
pnpm install
```

## Running Locally

1. Sign into the [Coinbase CDP portal](https://portal.cdp.coinbase.com)

2. Following `.env.example`, set the following environment variables in `.env.local`:

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`
- `CDP_WALLET_SECRET`

3. Run `pnpm dev`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Testing Payments

By default, the app uses the `base-sepolia` network, or "testnet". This is a testing network with fake money. The app is configured to automically request more funds from a faucet (source of testnet money) when your account is running low. You can also do this yourself in the [Coinbase CDP dashboard](https://portal.cdp.coinbase.com/products/faucet?token=USDC&network=base-sepolia).

## Going to Production

When you're ready to deploy your SaaS application to production, follow these steps:

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it.
3. Follow the Vercel deployment process, which will guide you through setting up your project.

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`
- `CDP_WALLET_SECRET`

## Moving to mainnet

To move to mainnet, set the `NETWORK` environment variable to `base`.

Make sure that the `Purchaser` account has enough funds to pay for the tools you're using. To fund the account, you can send USDC to the account's address in the [Coinbase CDP dashboard](https://portal.cdp.coinbase.com/products/server-wallet?accountType=evm-eoa).
