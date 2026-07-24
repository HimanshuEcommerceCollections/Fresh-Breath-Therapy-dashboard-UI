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
};

export default nextConfig;
