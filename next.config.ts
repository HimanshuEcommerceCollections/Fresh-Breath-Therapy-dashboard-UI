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
      // ── baseline security headers, every route ──────────────────
      //
      // X-Frame-Options is the load-bearing one HERE. The backend sets a
      // copy too, but nobody usefully frames a JSON response — the
      // clickjacking target is this dashboard. It is the COMPLEMENT to the
      // API's CSRF middleware, not a duplicate: CSRF protection rejects
      // requests from foreign origins, whereas clickjacking makes a
      // logged-in admin click inside OUR origin (an invisible frame under
      // attacker bait), so the resulting request carries a legitimate
      // Origin and passes every check the API has. Only refusing to be
      // framed stops it.
      //
      // Referrer-Policy keeps the staff email in /verify-otp?email=... out
      // of the Referer header on any outbound navigation.
      //
      // HSTS is production-only. NODE_ENV is "development" under next dev,
      // so it is never sent over local HTTP — belt and braces alongside
      // RFC 6797 section 8.1, which already requires browsers to ignore it
      // there. No preload (submission is a one-way door) and no
      // includeSubDomains (nothing is served beneath this hostname).
      //
      // NOT set here: Content-Security-Policy. Next 16 needs a per-request
      // nonce via the proxy.ts convention, and its own docs require dynamic
      // rendering to use one — which would disable static optimisation
      // across the app. That is an architectural decision, not a header, so
      // it is deliberately left as separate work.
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
            : []),
        ],
      },
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
