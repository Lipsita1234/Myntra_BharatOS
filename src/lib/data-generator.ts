/**
 * Synthetic Data Generator for Myntra BharatOS
 * Generates realistic logistics data following Indian e-commerce business rules.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Reference Data ───────────────────────────────────────────────────────────

const CITIES: { name: string; state: string; lat: number; lng: number }[] = [
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { name: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
  { name: "Chandigarh", state: "Punjab", lat: 30.7333, lng: 76.7794 },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
  { name: "Vijayawada", state: "Andhra Pradesh", lat: 16.5062, lng: 80.6480 },
  { name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362 },
  { name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  { name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296 },
  { name: "Panaji", state: "Goa", lat: 15.4909, lng: 73.8278 },
  { name: "Rajkot", state: "Gujarat", lat: 22.3039, lng: 70.8022 },
  { name: "Vadodara", state: "Gujarat", lat: 22.3072, lng: 73.1812 },
  { name: "Gurugram", state: "Haryana", lat: 28.4595, lng: 77.0266 },
  { name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
  { name: "Srinagar", state: "Jammu and Kashmir", lat: 34.0837, lng: 74.7973 },
  { name: "Ranchi", state: "Jharkhand", lat: 23.3441, lng: 85.3096 },
  { name: "Mangalore", state: "Karnataka", lat: 12.9141, lng: 74.8560 },
  { name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  { name: "Gwalior", state: "Madhya Pradesh", lat: 26.2183, lng: 78.1828 },
  { name: "Nashik", state: "Maharashtra", lat: 20.0110, lng: 73.7903 },
  { name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245 },
  { name: "Ludhiana", state: "Punjab", lat: 30.9010, lng: 75.8573 },
  { name: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081 },
  { name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319 },
  { name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { name: "Siliguri", state: "West Bengal", lat: 26.7271, lng: 88.3953 },
];

const FIRST_NAMES = [
  "Aarav", "Priya", "Rahul", "Sneha", "Arjun", "Kavya", "Vikram", "Anjali",
  "Rohan", "Meera", "Amit", "Pooja", "Suresh", "Deepika", "Rajesh", "Nidhi",
  "Kiran", "Isha", "Nikhil", "Ritu", "Harsh", "Divya", "Siddharth", "Neha",
  "Prakash", "Shweta", "Gaurav", "Tanvi", "Sachin", "Priyanka"
];

const LAST_NAMES = [
  "Sharma", "Gupta", "Singh", "Patel", "Mehta", "Agarwal", "Kumar", "Verma",
  "Joshi", "Shah", "Rao", "Nair", "Reddy", "Iyer", "Chaudhary", "Mishra",
  "Dubey", "Tiwari", "Srivastava", "Pandey", "Kulkarni", "Desai", "Chopra", "Malhotra"
];

const PRODUCT_CATEGORIES: {
  name: string;
  items: { name: string; priceMin: number; priceMax: number }[];
}[] = [
  {
    name: "Apparel",
    items: [
      { name: "Silk Saree", priceMin: 1200, priceMax: 8000 },
      { name: "Salwar Kameez", priceMin: 800, priceMax: 3500 },
      { name: "Kurta Set", priceMin: 600, priceMax: 2500 },
      { name: "Lehenga", priceMin: 2000, priceMax: 15000 },
      { name: "Denim Jeans", priceMin: 800, priceMax: 2500 },
      { name: "Cotton T-Shirt", priceMin: 300, priceMax: 800 },
      { name: "Winter Jacket", priceMin: 1500, priceMax: 5000 },
    ],
  },
  {
    name: "Footwear",
    items: [
      { name: "Sports Shoes", priceMin: 1000, priceMax: 6000 },
      { name: "Ethnic Jutis", priceMin: 500, priceMax: 2000 },
      { name: "Sandals", priceMin: 400, priceMax: 1500 },
      { name: "Heels", priceMin: 800, priceMax: 3000 },
      { name: "Loafers", priceMin: 700, priceMax: 2500 },
    ],
  },
  {
    name: "Accessories",
    items: [
      { name: "Handbag", priceMin: 600, priceMax: 5000 },
      { name: "Sunglasses", priceMin: 300, priceMax: 2000 },
      { name: "Watch", priceMin: 1500, priceMax: 10000 },
      { name: "Jewellery Set", priceMin: 800, priceMax: 8000 },
      { name: "Belt", priceMin: 200, priceMax: 1000 },
    ],
  },
  {
    name: "Home Decor",
    items: [
      { name: "Cushion Cover Set", priceMin: 400, priceMax: 1200 },
      { name: "Table Runner", priceMin: 300, priceMax: 800 },
      { name: "Wall Art", priceMin: 600, priceMax: 3000 },
      { name: "Vase Set", priceMin: 500, priceMax: 2000 },
    ],
  },
  {
    name: "Beauty",
    items: [
      { name: "Skincare Kit", priceMin: 800, priceMax: 3500 },
      { name: "Lipstick Set", priceMin: 300, priceMax: 1200 },
      { name: "Perfume", priceMin: 600, priceMax: 5000 },
      { name: "Hair Care Set", priceMin: 500, priceMax: 2000 },
    ],
  },
];

const VEHICLE_TYPES = ["Bike", "Van", "Truck", "EV Bike", "EV Van"];
const STATUSES = { vehicle: ["idle", "en_route", "maintenance"], order: ["pending", "processing", "shipped", "delivered", "cancelled"] };
const DELIVERY_MODES = ["direct", "cluster"];

// ─── Utilities ────────────────────────────────────────────────────────────────

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randName(): string {
  return `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`;
}

function randEmail(name: string, idx: number): string {
  return `${name.toLowerCase().replace(" ", ".")}${idx}@example.com`;
}

/** Seasonal demand multiplier based on Indian festival calendar (month 0-indexed) */
function seasonalMultiplier(month: number): number {
  const factors: Record<number, number> = {
    0: 0.7,  // Jan - post-holiday slump
    1: 0.8,  // Feb - Valentine's
    2: 0.85, // Mar
    3: 0.9,  // Apr
    4: 1.1,  // May - Summer sale
    5: 1.2,  // Jun - End of season
    6: 0.75, // Jul - monsoon slump
    7: 0.8,  // Aug - Independence Day
    8: 1.1,  // Sep - festive prep
    9: 1.5,  // Oct - Dussehra, Navratri
    10: 1.8, // Nov - Diwali peak
    11: 1.3, // Dec - New Year
  };
  return factors[month] ?? 1.0;
}

/** Regional category affinity */
function regionAffinity(state: string, category: string): number {
  const affinities: Record<string, Record<string, number>> = {
    Maharashtra: { Apparel: 1.3, Accessories: 1.2, Beauty: 1.1 },
    Karnataka: { Apparel: 1.2, Footwear: 1.1, "Home Decor": 1.3 },
    "Tamil Nadu": { Apparel: 1.4, Beauty: 1.2 },
    Delhi: { Accessories: 1.5, Footwear: 1.3, Apparel: 1.2 },
    "West Bengal": { Apparel: 1.3, "Home Decor": 1.2 },
    Gujarat: { "Home Decor": 1.4, Accessories: 1.3 },
    Rajasthan: { Apparel: 1.5, Accessories: 1.4 },
    "Uttar Pradesh": { Apparel: 1.3, Beauty: 1.0 },
  };
  return affinities[state]?.[category] ?? 1.0;
}

function jitter(lat: number, lng: number, radiusKm = 20): { lat: number; lng: number } {
  const r = radiusKm / 111.32;
  return {
    lat: parseFloat((lat + (Math.random() - 0.5) * r * 2).toFixed(5)),
    lng: parseFloat((lng + (Math.random() - 0.5) * r * 2).toFixed(5)),
  };
}

function pastDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - randInt(0, daysAgo));
  return d;
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export async function generateSyntheticData(options: {
  customerCount?: number;
  sellerCount?: number;
  productsPerSeller?: number;
  orderCount?: number;
  warehouseCount?: number;
  vehicleCount?: number;
  clusterCount?: number;
  microHubCount?: number;
  clearFirst?: boolean;
} = {}) {
  const {
    customerCount = 250,
    sellerCount = 200,
    productsPerSeller = 2,
    orderCount = 2500,
    warehouseCount = 220,
    vehicleCount = 250,
    clusterCount = 220,
    microHubCount = 220,
    clearFirst = true,
  } = options;

  if (clearFirst) {
    console.log("🗑️  Clearing existing generated data...");
    await prisma.notification.deleteMany({});
    await prisma.alert.deleteMany({});
    await prisma.sustainability.deleteMany({});
    await prisma.demandForecast.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cluster.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.microHub.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.warehouse.deleteMany({});
    // Keep fixed system users, delete generated customers/sellers
    await prisma.user.deleteMany({
      where: { email: { notIn: ["admin@myntra.com", "ops@myntra.com", "seller@myntra.com", "customer@myntra.com"] } }
    });
  }

  // ── 1. System Users (upsert — never recreate these) ──────────────────────
  console.log("👤 Upserting system users...");
  await prisma.user.upsert({
    where: { email: "admin@myntra.com" },
    update: {},
    create: { userId: "USR-ADMIN", name: "Executive Admin", email: "admin@myntra.com", password: "password123", role: "admin" },
  });
  await prisma.user.upsert({
    where: { email: "ops@myntra.com" },
    update: {},
    create: { userId: "USR-OPS", name: "Priya Sharma", email: "ops@myntra.com", password: "password123", role: "operations" },
  });
  const sellerUser = await prisma.user.upsert({
    where: { email: "seller@myntra.com" },
    update: {},
    create: { userId: "USR-SELLER", name: "Saree World", email: "seller@myntra.com", password: "password123", role: "seller" },
  });
  const customerUser = await prisma.user.upsert({
    where: { email: "customer@myntra.com" },
    update: {},
    create: { userId: "USR-CUST", name: "Anish Gupta", email: "customer@myntra.com", password: "password123", role: "customer" },
  });

  // ── 2. Generate Sellers ──────────────────────────────────────────────────
  console.log(`🏪 Generating ${sellerCount} sellers...`);
  const SELLER_BRANDS = [
    "FashionKart", "SilkRoutes", "KurtiCo", "UrbanFits", "DesiStyle",
    "EthnicHub", "TrendMakers", "StyleStation", "FabricWave", "IndoChic",
    "GlamourNest", "AuraFits", "ModernThreads", "VintageVibes", "EliteWear"
  ];
  const generatedSellers = [];
  for (let i = 0; i < sellerCount; i++) {
    const name = `${rand(SELLER_BRANDS)} ${i + 1}`;
    const city = rand(CITIES);
    const seller = await prisma.user.create({
      data: {
        name,
        email: `seller.${name.toLowerCase().replace(/\s/g, '')}@business.com`,
        password: "password123",
        role: "seller",
        phone: `+91${randInt(7000000000, 9999999999)}`,
        address: `${randInt(1, 200)}, ${city.name}`,
      },
    });
    generatedSellers.push(seller);
  }
  const allSellers = [sellerUser, ...generatedSellers];

  // ── 3. Generate Customers ────────────────────────────────────────────────
  console.log(`👥 Generating ${customerCount} customers...`);
  const generatedCustomers = [];
  for (let i = 0; i < customerCount; i++) {
    const name = randName();
    const city = rand(CITIES);
    const customer = await prisma.user.create({
      data: {
        name,
        email: randEmail(name, i + 1),
        password: "password123",
        role: "customer",
        phone: `+91${randInt(7000000000, 9999999999)}`,
        address: `${randInt(1, 500)} ${rand(["MG Road", "Gandhi Nagar", "Park Street", "Main Bazaar", "Civil Lines"])}, ${city.name}`,
      },
    });
    generatedCustomers.push({ user: customer, city });
  }
  const allCustomers = [{ user: customerUser, city: CITIES[0] }, ...generatedCustomers];

  // ── 4. Warehouses ────────────────────────────────────────────────────────
  console.log(`🏭 Generating ${warehouseCount} warehouses...`);
  const warehouseCities = Array.from({ length: warehouseCount }, (_, i) => CITIES[i % CITIES.length]);
  const warehouses = [];
  for (let i = 0; i < warehouseCount; i++) {
    const city = warehouseCities[i];
    const suffix = Math.floor(i / CITIES.length) > 0 ? `-${Math.floor(i / CITIES.length) + 1}` : "";
    const pos = jitter(city.lat, city.lng, 15); // Add natural jitter
    const cap = randInt(500, 2000);
    const inv = randInt(Math.floor(cap * 0.3), Math.floor(cap * 0.9));
    const wh = await prisma.warehouse.create({
      data: {
        name: `${city.name} Fulfillment Center${suffix}`,
        location: `${city.name}, ${city.state}`,
        city: city.name,
        state: city.state,
        capacity: cap,
        inventory: inv,
        utilization: parseFloat(((inv / cap) * 100).toFixed(1)),
        orders: randInt(20, 200),
        lat: pos.lat,
        lng: pos.lng,
        rating: randFloat(3.8, 4.9, 1),
        returnRate: randFloat(2, 12, 1),
        deliveryDays: randFloat(1.2, 4.5, 1),
      },
    });
    warehouses.push(wh);
  }

  // ── 5. Vehicles ──────────────────────────────────────────────────────────
  console.log(`🚛 Generating ${vehicleCount} vehicles...`);
  const vehicles = [];
  for (let i = 0; i < vehicleCount; i++) {
    const city = rand(warehouseCities);
    const pos = jitter(city.lat, city.lng, 15);
    const type = rand(VEHICLE_TYPES);
    const status = rand(["idle", "idle", "idle", "en_route", "en_route", "maintenance"]);
    const v = await prisma.vehicle.create({
      data: {
        driver: randName(),
        vehicleType: type,
        fuel: randFloat(20, 100),
        status,
        deliveries: randInt(0, 150),
        rating: randFloat(3.5, 5.0),
        currentLocation: `${pos.lat},${pos.lng}`,
        lat: pos.lat,
        lng: pos.lng,
        route: JSON.stringify([]),
      },
    });
    vehicles.push(v);
  }

  // ── 6. Micro-Hubs ────────────────────────────────────────────────────────
  console.log(`📦 Generating ${microHubCount} micro-hubs...`);
  const hubCities = Array.from({ length: microHubCount }, (_, i) => CITIES[i % CITIES.length]);
  for (let i = 0; i < microHubCount; i++) {
    const city = hubCities[i];
    const suffix = Math.floor(i / CITIES.length) > 0 ? `-${Math.floor(i / CITIES.length) + 1}` : "";
    const pos = jitter(city.lat, city.lng, 8);
    await prisma.microHub.create({
      data: {
        name: `${city.name} Micro-Hub${suffix}`,
        location: `${city.name}, ${city.state}`,
        city: city.name,
        capacity: randInt(30, 150),
        orders: randInt(5, 80),
        savings: randFloat(1000, 25000),
        status: rand(["active", "active", "active", "full"]),
        hubType: rand(["permanent", "permanent", "temporary"]),
        lat: pos.lat,
        lng: pos.lng,
      },
    });
  }

  // ── 7. Products ──────────────────────────────────────────────────────────
  console.log("🛍️  Generating products...");
  const products = [];
  for (const seller of allSellers) {
    const numProducts = seller.userId === "USR-SELLER" ? 10 : productsPerSeller;
    for (let i = 0; i < numProducts; i++) {
      const catData = rand(PRODUCT_CATEGORIES);
      const item = rand(catData.items);
      const price = randFloat(item.priceMin, item.priceMax);
      const stock = randInt(0, 500);
      const sold = randInt(0, 200);
      const reorderLevel = randInt(10, 50);
      const status = stock === 0 ? "out_of_stock" : stock < reorderLevel ? "low_stock" : "healthy";
      const p = await prisma.product.create({
        data: {
          name: item.name,
          category: catData.name,
          price,
          stock,
          sold,
          reorderLevel,
          status,
          sellerId: seller.userId,
        },
      });
      products.push({ product: p, category: catData.name });
    }
  }

  // ── 8. Clusters ──────────────────────────────────────────────────────────
  console.log(`🔵 Generating ${clusterCount} clusters...`);
  const clusters = [];
  for (let i = 0; i < clusterCount; i++) {
    const city = rand(warehouseCities);
    const pos = jitter(city.lat, city.lng, 10);
    const maxMembers = randInt(5, 15);
    const members = randInt(2, maxMembers);
    const cl = await prisma.cluster.create({
      data: {
        name: `${city.name}-Cluster-${String(i + 1).padStart(3, "0")}`,
        location: `${city.name}, ${city.state}`,
        city: city.name,
        lat: pos.lat,
        lng: pos.lng,
        members,
        maxMembers,
        status: rand(["forming", "forming", "active", "completed"]),
        completionProbability: randFloat(50, 99),
        savings: randFloat(50, 800),
        eta: `${randInt(1, 5)} days`,
      },
    });
    clusters.push(cl);
  }

  // ── 9. Orders ────────────────────────────────────────────────────────────
  console.log(`📋 Generating ${orderCount} orders...`);
  const now = new Date();
  for (let i = 0; i < orderCount; i++) {
    const { user: customer, city: custCity } = rand(allCustomers);
    const { product, category } = rand(products);
    const warehouse = rand(warehouses);
    
    // Apply seasonal & regional demand logic
    const daysAgo = randInt(0, 180);
    const orderDate = new Date(now.getTime() - daysAgo * 86400000);
    const month = orderDate.getMonth();
    const seasonal = seasonalMultiplier(month);
    const regional = regionAffinity(custCity.state, category);

    // The probability this order exists is proportional to demand
    const demandScore = seasonal * regional;

    const statusWeights = demandScore > 1.3
      ? ["delivered", "delivered", "delivered", "shipped", "processing", "pending"] // high demand periods — more activity
      : ["delivered", "delivered", "shipped", "processing", "pending", "cancelled"];
    
    const status = rand(statusWeights);
    const deliveryMode = rand([...DELIVERY_MODES, ...DELIVERY_MODES, "cluster"]); // cluster slightly more likely
    
    const pos = jitter(custCity.lat, custCity.lng, 8);
    const amount = randFloat(product.price * 0.8, product.price * 1.2);
    const shippingCost = deliveryMode === "cluster" ? randFloat(0, 30) : randFloat(40, 120);

    await prisma.order.create({
      data: {
        customerId: customer.userId,
        sellerId: product.sellerId,
        productName: product.name,
        productId: product.productId,
        warehouseId: warehouse.warehouseId,
        status,
        deliveryMode,
        amount,
        shippingCost,
        location: `${custCity.name}, ${custCity.state}`,
        lat: pos.lat,
        lng: pos.lng,
        createdAt: orderDate,
      },
    });
  }

  // ── 10. Demand Forecasts ──────────────────────────────────────────────────
  console.log("📈 Generating demand forecasts...");
  for (const city of warehouseCities) {
    for (const catData of PRODUCT_CATEGORIES) {
      const seasonal = seasonalMultiplier(now.getMonth());
      const regional = regionAffinity(city.state, catData.name);
      const current = randInt(80, 500);
      const predicted = Math.round(current * seasonal * regional);
      await prisma.demandForecast.create({
        data: {
          region: city.name,
          state: city.state,
          product: catData.name,
          currentDemand: current,
          predictedDemand: predicted,
          change: parseFloat((((predicted - current) / current) * 100).toFixed(1)),
          factor: seasonal > 1.3 ? "Festival Season" : seasonal > 1.0 ? "Seasonal Uptick" : "Off-Season",
          confidence: randFloat(75, 98),
        },
      });
    }
  }

  // ── 11. Sustainability Record ────────────────────────────────────────────
  console.log("🌱 Generating sustainability data...");
  await prisma.sustainability.create({
    data: {
      fuelSaved: randFloat(200, 800),
      distanceSaved: randFloat(1000, 5000),
      co2Reduced: randFloat(300, 1200),
      deliveriesOptimized: randInt(200, 1000),
      moneySaved: randFloat(50000, 250000),
      tripsReduced: randInt(100, 500),
    },
  });

  // ── 12. Alerts ────────────────────────────────────────────────────────────
  console.log("🔔 Generating alerts...");
  const alertTemplates = [
    { type: "warning", severity: "high", title: "Warehouse Near Capacity", description: `${rand(warehouseCities).name} warehouse at 92% capacity.` },
    { type: "info", severity: "low", title: "New Cluster Formed", description: `A new delivery cluster formed in ${rand(warehouseCities).name}.` },
    { type: "critical", severity: "critical", title: "Vehicle Breakdown", description: `Vehicle needs emergency maintenance in ${rand(warehouseCities).name}.` },
    { type: "info", severity: "medium", title: "Festival Demand Spike", description: "Demand predicted to rise 40% over next 2 weeks." },
    { type: "warning", severity: "medium", title: "Low Inventory Alert", description: `${rand(PRODUCT_CATEGORIES).name} category running below reorder level.` },
  ];
  for (const template of alertTemplates) {
    await prisma.alert.create({
      data: { ...template, region: rand(warehouseCities).name, resolved: false },
    });
  }

  const result = {
    customers: allCustomers.length,
    sellers: allSellers.length,
    products: products.length,
    warehouses: warehouses.length,
    vehicles: vehicles.length,
    orders: orderCount,
    clusters: clusters.length,
  };

  console.log("✅ Synthetic data generation complete:", result);
  return result;
}
