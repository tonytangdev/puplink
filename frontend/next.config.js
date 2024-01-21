/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: process.env.IMAGE_PROTOCOL,
                hostname: process.env.IMAGES_URL,
                port: '',
            }
        ],
    },
}

module.exports = nextConfig
