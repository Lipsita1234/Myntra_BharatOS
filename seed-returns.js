const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const orders = await prisma.order.findMany({ take: 30, where: { status: 'delivered' } });
  for (const o of orders) {
    await prisma.order.update({
      where: { orderId: o.orderId },
      data: { status: 'returned', returnReason: 'Size issue', returnSavings: 45.0 }
    });
  }
  console.log('Updated 30 orders to returned status');
}
main().finally(() => prisma.$disconnect());
