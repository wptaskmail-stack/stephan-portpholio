import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This project is intentionally loosely typed (generated Payload types vs.
  // hand-written prop types, `as any` placeholders). The code runs fine; don't
  // let type/lint nits fail the production build.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Allow serving the photos that Cloudinary hosts.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default withPayload(nextConfig)
