const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : 'kagimdnkyqfduhcbkceo.supabase.co';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // Enable Next.js Image Optimization to proxy and cache remote Supabase images at edge
    unoptimized: false,
  },

  // Cache headers for static assets and proxied images (Section 6, Items 1-2)
  async headers() {
    return [
      {
        // Long cache for all static assets in /public
        source: '/:path*.(png|jpg|jpeg|webp|avif|svg|ico|mp4)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
