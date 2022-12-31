/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: '.next',
  eslint: {
    ignoreDuringBuilds: true,
    },
  compiler: {
    styledComponents: true,
  },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
}

// const withTranspilation = require("next-transpile-modules")([
//   "@doubledice/platform"
// ])

// module.exports = nextConfig;

