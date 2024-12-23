/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "localhost:8096",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
            },
        ],
    },
};

export default nextConfig;