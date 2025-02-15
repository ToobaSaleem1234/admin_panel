import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['cdn.sanity.io'],
  },
  eslint: {
    ignoreDuringBuilds: true, 
    dirs: ['app', 'components'],
  },
};

module.exports = nextConfig;

export default nextConfig;
