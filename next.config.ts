/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['khajan-final.vercel.app'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
