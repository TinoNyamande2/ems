/** @type {import('next').NextConfig} */
const nextConfig = {reactStrictMode: true,
    transpilePackages: ['@mui/x-charts'],
    experimental: {
        missingSuspenseWithCSRBailout: false,
      },
      async headers() {
        return [
          {
            source: '/:path*',
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-store',
              },
              {
                key: 'Pragma',
                value: 'no-cache',
              },
              {
                key: 'Expires',
                value: '0',
              },
              {
                key: 'Surrogate-Control',
                value: 'no-store',
              },
            ],
          },
        ];
      },
    };
    


export default nextConfig;
