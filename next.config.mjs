/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/isabella-villasenor-ai", destination: "/isabella", permanent: true },
      { source: "/isabella-villasenor", destination: "/isabella", permanent: true },
      { source: "/anubis-villasenor/isabella", destination: "/isabella", permanent: true },
      { source: "/tamv/isabella", destination: "/isabella", permanent: true },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
