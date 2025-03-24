/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      // {
      //   source: "/api/auth/:path",
      //   destination: "/api/auth/:path*",
      // },
      // {
      //   source: "/api/:path*",
      //   destination: "http://localhost:5000/api/:path*",
      // },
    ];
  },
};

module.exports = nextConfig;
