/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: 'build',
  compiler: {
    styledComponents: true,
  },
}

const withTranspilation = require("next-transpile-modules")([
  "@doubledice/platform"
])

module.exports = withTranspilation(nextConfig)
