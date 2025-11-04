import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['images.unsplash.com', 'app.penerra.in', 'secure.gravatar.com']
  }
}

export default nextConfig
