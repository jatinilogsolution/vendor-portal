import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "swimlocker.blob.core.windows.net",
        port: "", // optional
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.awlindia.com",
        port: "", // optional
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
      allowedOrigins: [
        "vendorportal.awlindia.com",
        "www.vendorportal.awlindia.com",
      ],
    },
    globalNotFound: true,
    authInterrupts: true,
  },
};

export default nextConfig;
