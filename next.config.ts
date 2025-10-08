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
      
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
