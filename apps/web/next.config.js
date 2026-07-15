/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tools-website/ui', '@tools-website/utils', '@tools-website/config', '@tools-website/shared-types'],
};

module.exports = nextConfig;
// Empty comment to avoid lint problems
