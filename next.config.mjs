/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@/components/ui"],
  },
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };
    return config;
  },
};

export default nextConfig;
