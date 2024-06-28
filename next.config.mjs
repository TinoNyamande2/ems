/** @type {import('next').NextConfig} */
const nextConfig = {reactStrictMode: true,
    transpilePackages: ['@mui/x-charts'],
    experimental: {
        missingSuspenseWithCSRBailout: false,
      }
    };
    


export default nextConfig;
