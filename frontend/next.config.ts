
/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/:path*`, 
      },
    ];
  },
  eslint: { ignoreDuringBuilds: true }, 
};
