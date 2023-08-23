/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
module.exports = {
    
    images: {
      domains: ['13.238.130.147','13.236.235.254','localhost' ],
    },
    async redirects() {
      return [
        {
          source: '/login',
          has: [
            {
              type: 'cookie',
              key: 'accessToken',
            },
          ],
          permanent: false,
          destination: '/',
        },
         {
           source: '/',
           missing: [
             {
               type: 'cookie',
               key: 'accessToken',
             },
           ],
           permanent: false,
           destination: '/login',
        },
      ];
    },
  };
  