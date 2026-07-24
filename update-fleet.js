const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CITIES = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 
  'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 
  'Jaipur', 'Surat', 'Lucknow', 'Kanpur'
];

async function main() {
  const vehicles = await prisma.vehicle.findMany();
  
  for (const v of vehicles) {
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    
    // Determine status (40% active, 30% idle, 30% offline)
    const r = Math.random();
    let status = 'offline';
    let packages = 0;
    let eta = '-';
    
    if (r < 0.4) {
      status = 'active';
      packages = Math.floor(Math.random() * 50) + 10;
      eta = `${Math.floor(Math.random() * 60) + 10} mins`;
    } else if (r < 0.7) {
      status = 'idle';
    }
    
    await prisma.vehicle.update({
      where: { vehicleId: v.vehicleId },
      data: {
        city: randomCity,
        status: status,
        packages: packages,
        eta: eta
      }
    });
  }
  
  console.log('Successfully randomized cities and statuses for all 250 vehicles.');
}

main().finally(() => prisma.$disconnect());
