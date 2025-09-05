import { makeApiClient } from "@/lib/axios";

const api = makeApiClient({
  enablePayment: true,
  baseURL: "https://www.triangletest2.link",
});

const response = await api.get("/", {
  headers: {
    "x402-test": "1000; 0x4cfA20938447559D444e8721Af84DB09f8d04965",
  },
});

console.log(response.data);
