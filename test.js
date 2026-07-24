const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.order.groupBy({ by: ['status'], _count: true }).then(console.log).finally(() => prisma.$disconnect());
