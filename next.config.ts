import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org'
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com'
      }
    ],
  },
};

export default nextConfig;
