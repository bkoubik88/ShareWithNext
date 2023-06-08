/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  env: {
    BASE_URL: process.env.BASE_URL,
  },
  experimental: {
    serverActions: true,
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
