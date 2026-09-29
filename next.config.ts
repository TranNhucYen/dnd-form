import type { NextConfig } from 'next';

type Pattern = { protocol: 'http' | 'https'; hostname: string; port: string };

function storageImagePatterns(): Pattern[] {
  const raw = process.env.S3_PUBLIC_URL;
  if (!raw) return [];
  try {
    const url = new URL(raw);
    return [
      {
        protocol: url.protocol === 'https:' ? 'https' : 'http',
        hostname: url.hostname,
        port: url.port,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  images: {
    remotePatterns: storageImagePatterns(),
  },
};

export default nextConfig;
