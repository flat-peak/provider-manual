import { FlatpeakService } from "@flat-peak/javascript-sdk";

const flatpeak = new FlatpeakService(
  process.env.DEFAULT_API_URL || "https://api.flatpeak.energy",
  process.env.DEFAULT_PUBLISHABLE_KEY || "",
  (message) => {
    console.log("[SERVICE]: " + message);
  }
);
const throwOnApiError = (input) => {
  if (input?.object === "error") {
    throw new Error(input.message);
  }
  return input;
};

export { flatpeak, throwOnApiError };
