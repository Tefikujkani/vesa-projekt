/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'], // Add any other image domains you're using
  },
  // Enable static exports for better performance
  output: 'standalone',
}

module.exports = nextConfig 