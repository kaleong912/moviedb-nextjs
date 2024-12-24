import type { NextConfig } from "next";
const path = require('path')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.wmoov.com",
        port: "",
        pathname: "/**",
      }
    ]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

export default nextConfig;
