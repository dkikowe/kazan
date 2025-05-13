/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  images: {
    domains: ["kazanmy-bucket.s3.eu-north-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
