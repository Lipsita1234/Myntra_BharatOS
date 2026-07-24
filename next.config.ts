import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./prisma/prisma/dev.db', './prisma/dev.db'],
  },
};

export default nextConfig;
