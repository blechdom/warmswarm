/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds for Docker
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checks during builds for Docker
    ignoreBuildErrors: true,
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;