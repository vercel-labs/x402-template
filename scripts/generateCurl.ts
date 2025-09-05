import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { createPaymentHeader, selectPaymentRequirements } from "x402/client";
import { Wallet } from "x402/types";

const account = privateKeyToAccount(`0x${process.env.X402_PRIVATE_KEY}`);
const walletClient = createWalletClient({
  account,
  transport: http(),
  chain: baseSepolia,
});


const { x402Version, accepts } = {
  "accepts": [
    {
      "network": "base-sepolia",
      "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      "mimeType": "application/json",
      "outputSchema": {
        "input": { "method": "GET", "discoverable": true, "type": "http" }
      },
      "maxAmountRequired": "1000",
      "scheme": "exact",
      "description": "Access to protected content",
      "resource": "https://www.triangletest2.link",
      "extra": { "version": "2", "name": "USDC" },
      "maxTimeoutSeconds": 300,
      "payTo": "0x4cfA20938447559D444e8721Af84DB09f8d04965"
    } as const
  ] as const,
  "x402Version": 1
} as const;


const selectedPaymentRequirements = selectPaymentRequirements(
  accepts,
  "base-sepolia",
  "exact"
);

const paymentHeader = await createPaymentHeader(
  walletClient as unknown as Wallet,
  x402Version,
  selectedPaymentRequirements
);

const baseCommand = process.env.RCURL ? "rcurl localhost" : "curl";

console.log(
  `${baseCommand} 'https://www.triangletest2.link/' --header 'x402-test: 1000;0x4cfA20938447559D444e8721Af84DB09f8d04965' --header 'X-PAYMENT: ${paymentHeader}'`
);
