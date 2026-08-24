import type { NextConfig } from "next";

// ── Content-Security-Policy ───────────────────────────────────────────────
//
// Deliberately WITHOUT script nonces, and that is the design decision, not an
// omission.
//
// A strict policy needs a fresh nonce per request, which in Next 16 means the
// proxy.ts convention — and its own documentation requires DYNAMIC RENDERING to
// use one, which would switch off static optimisation across the app. It is
// also architecturally unavailable on the planned deployment: a static
// S3 + CloudFront build has no server in the request path to generate a nonce,
// so it would additionally require Lambda@Edge.
//
// So 'unsafe-inline' stays on script-src. What that gives up is protection
// against injected INLINE script. What it keeps is the part that matters most
// for PHI:
//
//   connect-src      the exfiltration route. Injected script cannot POST
//                    patient data to an attacker's domain — the step that
//                    turns an XSS into a breach.
//   frame-ancestors  clickjacking, alongside X-Frame-Options.
//   object-src       plugin-based execution.
//   base-uri         <base> hijacking, which silently repoints relative URLs.
//   form-action      a planted form posting credentials off-site.
//
// Recorded as a deliberate trade: the useful majority of a CSP at zero
// architectural cost. Revisit if the frontend moves to a server runtime.

// Same value and same fallback the Axios client uses, so the policy cannot
// drift from the host the app actually calls.
const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://fresh-breath-therapy-dashboard-serv.vercel.app";

const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  // 'unsafe-eval' and the websocket are DEV ONLY — Turbopack's hot reload needs
  // both. Neither appears in a production build.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Cloudinary serves therapist avatars (see images.remotePatterns below).
  // data: and blob: cover inline SVG and client-side previews.
  "img-src 'self' data: blob: https://res.cloudinary.com",
  // next/font/google self-hosts at build time, so no Google host is needed.
  "font-src 'self' data:",
  `connect-src 'self' ${API_ORIGIN}${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

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
      // Content-Security-Policy is set from the CSP constant above. It
      // deliberately carries no script nonce — see that block for why, and for
      // what that trade does and does not give up.
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Content-Security-Policy", value: CSP },
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
