import axios from "axios";
import * as AxiosLogger from "axios-logger";
import { withPaymentInterceptor } from "x402-axios";
import { decodeXPaymentResponse, safeBase64Decode } from "x402/shared";
import { account } from "./account";

AxiosLogger.setGlobalConfig({
  data: false,
});

export const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const getBaseAxios = (baseURL: string) =>
  axios.create({
    baseURL,
  });

export function makeApiClient(
  config: {
    enablePayment?: boolean;
    userAgent?: string;
    baseURL?: string;
  } = {}
) {
  const enablePayment = config.enablePayment ?? false;
  const userAgent = config.userAgent;
  const baseURL =
    typeof config.baseURL === "string" ? config.baseURL : BASE_URL;

  let axios = getBaseAxios(baseURL);

  axios.interceptors.request.use((request) => {
    console.log(`🚀 Making request to: ${request.baseURL}${request.url}`);
    if (request.headers["X-PAYMENT"]) {
      const payment = safeBase64Decode(request.headers["X-PAYMENT"]);
      const paymentString = JSON.stringify(JSON.parse(payment), null, 2);
      console.log("💳 Payment Header Present:", paymentString);
    } else {
      console.log("🚫 No payment header found");
    }

    return AxiosLogger.requestLogger(request);
  }, AxiosLogger.errorLogger);
  axios.interceptors.response.use(
    async (response) => {
      console.log(
        `✅ Success Response: ${response.status} ${response.statusText}`
      );
      if (response.headers["x-payment-response"]) {
        const paymentResponse = decodeXPaymentResponse(
          response.headers["x-payment-response"]
        );
        console.log(
          "💰 Payment Response Header:",
          JSON.stringify(paymentResponse, null, 2)
        );
      }
      return AxiosLogger.responseLogger(response);
    },
    async (error) => {
      console.log(
        `❌ Error Response: ${error.response?.status} ${error.response?.statusText}`
      );

      // 402 responses are errors, handle them here
      if (error.response?.status === 402) {
        console.log(
          "💸 402 Payment Required:",
          JSON.stringify(error.response.data, null, 2)
        );
      }

      return AxiosLogger.errorLogger(error);
    }
  );

  if (enablePayment) {
    axios = withPaymentInterceptor(axios, account);
  }

  if (userAgent) {
    axios.defaults.headers.common["user-agent"] = userAgent;
  }

  return axios;
}
