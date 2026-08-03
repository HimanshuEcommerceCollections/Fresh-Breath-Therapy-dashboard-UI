import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Therapist avatars are uploaded to Cloudinary by the backend
    // (POST /api/uploads/avatar) — see FBT_Backend_API_Reference.docx §6.1.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    // Icons/images under /public never change at a fixed URL — a new asset
    // gets a new filename, it doesn't overwrite the old one in place — so
    // it's safe to tell the browser to cache them for a year and skip
    // revalidation entirely. This is what actually fixes "icons are slow to
    // load on a bad connection": after the first visit, the browser's own
    // disk cache serves them instantly with zero network round-trip, no app
    // code involved. (Most hosts, including Vercel, already do this for
    // static assets in production — this makes it explicit and consistent
    // across every environment, including `next dev`, which does not.)
    return [
      {
        source: "/:path*.(svg|png|jpg|jpeg|gif|ico|webp|avif|woff|woff2|ttf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
