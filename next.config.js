// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['i.postimg.cc', 'images.ctfassets.net'],
    formats: ['image/webp'],
  }
};

module.exports = nextConfig; 