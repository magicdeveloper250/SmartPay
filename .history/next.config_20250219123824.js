/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // If building for the client-side, ignore Node.js-specific modules
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // Ignore 'fs' module
        net: false, // Ignore 'net' module
        dns: false, // Ignore 'dns' module
        tls: false, // Ignore 'tls' module
        child_process: false, // Ignore 'child_process' module
      };
    }

    return config;
  },
};

module.exports = nextConfig;