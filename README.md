# x402 + MCP + AI SDK Example

[x402](https://x402.org) is a new protocol built on top of HTTP for doing fully accountless payments easily, quickly, cheaply and securely.

This template built with [Next.js](https://nextjs.org), [AI SDK](https://ai-sdk.dev), [AI Elements](https://ai-elements.dev), and [AI Gateway](https://vercel.com/ai-gateway) shows off using x402 with a remote MCP server.

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
