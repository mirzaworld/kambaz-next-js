/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      {
        source: '/',              
        destination: '/account/signin',
        permanent: false,  
      },        
    ];
  },
};
export default nextConfig;
