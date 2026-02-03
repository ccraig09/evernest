import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Enable server actions
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

// In Next.js 13+ with TypeScript, withSentryConfig can be used as a wrapper.
// If your environment only supports 2 arguments, you can combine options or update the SDK.
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: "personal-dev-7b",
  project: "evernest",

  // Combined options for maximum compatibility with older type definitions
  // if 3 arguments are not recognized.
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
} as any);
