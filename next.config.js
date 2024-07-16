/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'images.unsplash.com', 'drive.google.com'],
    },
  }
  
  module.exports = nextConfig
  