# Next.js + x402 Template

[x402](https://x402.org) is a new protocol built on top of HTTP for doing fully accountless payments easily, quickly, cheaply and securely.

This template built with [Next.js](https://nextjs.org), [AI SDK](https://ai-sdk.dev), [AI Elements](https://ai-elements.dev), and [AI Gateway](https://vercel.com/ai-gateway) shows off basic usage of x402 to paywall APIs with just one middleware.

```ts
export const middleware = paymentMiddleware("0x...your wallet address...", {
  // pages
  "/blog": {
    price: "$0.01",
  },
  // api routes
  "/api/math/get-random-number": {
    price: "$0.05",
  },
  "/api/math/add": {
    price: "$0.10",
  },
});
```

## What is here?

- On the `/` page, you can chat with a bot that has access to some tools. These tools call APIs that are protected by x402. You can use the "Payment" button to enable payments.
- The `/blog` route is protected by x402, but only for bots. You can see what this is like for bots by using the `?bot=true` query parameter.
- The `/api/bot` route shows off an ai-less use of x402
  - It has two different "jobs" that can be run via the `job` query parameter
  - `job=math` will run call the math APIs
  - `job=blog` will scrape `/blog` and return its titles
  - By default it has payments disabled, but you can enable them by setting the `enable-payment` header to `true`
  - By default is not recognized as a bot, but you can enable that by setting the `user-agent` header to `bot`

## TODO

- [ ] Add x402 payments over to a remote MCP server

## To run locally

**Note**: In development, all transactions take place on the `base-sepolia` network or "testnet".

To get testnet funds, you can use the [Faucet in the Coinbase CDP portal](https://portal.cdp.coinbase.com/products/faucet?&token=USDC&network=base-sepolia). **Make sure to use the `base-sepolia` network and the `USDC` token.**

1. Install dependencies:

```bash
bun install
```

1. Set the following environment variables:
   - `X402_WALLET_ADDRESS` - the address payments will be sent to
   - `X402_PRIVATE_KEY` - the private key of the wallet that will be used to sign payments

If you don't have a wallet, you can create easily with [MetaMask](https://metamask.io).

2. Run the development server:

```bash
bun run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## To deploy

1. Set the following environment variables:
   - `CDP_API_KEY_ID` - the API key ID for the Coinbase CDP API
   - `CDP_API_KEY_SECRET` - the API key secret for the Coinbase CDP API

These are required to use Coinbase's mainnet facilitator in production.

2. Sign into the [Coinbase CDP portal](https://portal.cdp.coinbase.com) and create an API key.

3. Copy the API key ID and secret and set them as the environment variables.

4. Deploy the app to Vercel.
