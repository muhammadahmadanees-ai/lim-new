/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable Next.js Image Optimization for remote images
    // This automatically converts images to WebP/AVIF and serves responsive sizes,
    // reducing bandwidth significantly (Section 6, Item 4)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kagimdnkyqfduhcbkceo.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'wqkdkypfpgvubxfzokmg.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // Keep unoptimized for now to avoid breaking existing <img> tags in client components.
    // Server-rendered subpages can use <Image> individually.
    unoptimized: true,
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
