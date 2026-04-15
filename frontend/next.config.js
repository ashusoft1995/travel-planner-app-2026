/** @type {import('next').NextConfig} */
const backendUrl = (process.env.BACKEND_URL || "http://127.0.0.1:5000").replace(
  /\/$/,
  ""
);

const nextConfig = {
  transpilePackages: ["recharts"],
  /** Proxy /api/* to Express so the browser can use same-origin /api (avoids wrong-host 404s). */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

module.exports = nextConfig;

