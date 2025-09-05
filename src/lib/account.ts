import { privateKeyToAccount } from "viem/accounts";

const privateKey = `0x${process.env.X402_PRIVATE_KEY}` as const;
export const account = privateKeyToAccount(privateKey);
