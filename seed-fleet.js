const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const vehicles = await prisma.vehicle.findMany({ take: 10, where: { status: 'idle' } });
  
  for (const v of vehicles) {
    const packagesCount = Math.floor(Math.random() * 40) + 10;
    const etaMins = Math.floor(Math.random() * 45) + 15;
    
    await prisma.vehicle.update({
      where: { vehicleId: v.vehicleId },
      data: { 
        status: 'active', 
        packages: packagesCount, 
        eta: `${etaMins} mins` 
      }
    });
  }
  
  console.log('Updated 10 idle vehicles to active status with packages and ETAs.');
}

main().finally(() => prisma.$disconnect());
