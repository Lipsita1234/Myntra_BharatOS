// ============================================================
// Myntra BharatOS – Comprehensive Mock Data
// ============================================================

// ---------- Types ----------
export interface ClusterData {
  id: string;
  name: string;
  members: number;
  maxMembers: number;
  savings: number;
  deliveryTime: string;
  status: "active" | "forming" | "completed";
  location: { lat: number; lng: number };
  completionProbability: number;
  expectedTime: string;
}

export interface OrderData {
  id: string;
  customer: string;
  product: string;
  status: "pending" | "shipped" | "delivered" | "returned";
  amount: number;
  date: string;
  location: string;
  clusterId?: string;
}

export interface WarehouseData {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  capacity: number;
  utilization: number;
  orders: number;
  city: string;
  state: string;
}

export interface DriverData {
  id: string;
  name: string;
  status: "active" | "idle" | "offline";
  deliveries: number;
  rating: number;
  vehicle: string;
  currentLocation: { lat: number; lng: number };
  fuelLevel: number;
}

export interface MicroHubData {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  type: "permanent" | "temporary";
  orders: number;
  capacity: number;
  savings: number;
  city: string;
}

export interface DemandForecast {
  region: string;
  state: string;
  product: string;
  currentDemand: number;
  predictedDemand: number;
  change: number;
  factor: string;
  confidence: number;
}

export interface AlertData {
  id: string;
  type: "weather" | "traffic" | "capacity" | "driver" | "route" | "cluster";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timestamp: string;
  region: string;
}

export interface SustainabilityMetrics {
  co2Saved: number;
  fuelSaved: number;
  distanceSaved: number;
  moneySaved: number;
  treesEquivalent: number;
  tripsReduced: number;
  packagingOptimized: number;
}

export interface KPIData {
  totalOrders: number;
  totalSavings: number;
  carbonSaved: number;
  deliverySuccess: number;
  clusterSuccess: number;
  avgDeliveryTime: string;
  costReduction: number;
  activeDrivers: number;
  activeClusters: number;
  activeWarehouses: number;
}

export interface SellerInventory {
  id: string;
  product: string;
  category: string;
  stock: number;
  sold: number;
  reorderLevel: number;
  status: "healthy" | "low" | "critical";
  recommendation: string;
}

export interface ReturnData {
  id: string;
  orderId: string;
  reason: string;
  status: "requested" | "pickup_scheduled" | "picked_up" | "processed";
  location: { lat: number; lng: number };
  savings: number;
  clustered: boolean;
}

// ---------- Mock Data ----------

export const orders: OrderData[] = [
  { id: "ORD-001", customer: "Anish Gupta", product: "Sambalpuri Saree", status: "delivered", amount: 2400, date: "2024-01-15", location: "Bhubaneswar", clusterId: "CL-OD-204" },
  { id: "ORD-002", customer: "Priya Das", product: "Silk Dupatta", status: "shipped", amount: 850, date: "2024-01-15", location: "Cuttack", clusterId: "CL-OD-204" },
  { id: "ORD-003", customer: "Kunal Sen", product: "Kolhapuri Chappal", status: "pending", amount: 1200, date: "2024-01-15", location: "Mumbai" },
  { id: "ORD-004", customer: "Meera Nair", product: "Western Dress", status: "delivered", amount: 1800, date: "2024-01-14", location: "Bangalore", clusterId: "CLU-002" },
  { id: "ORD-005", customer: "Rahul Roy", product: "Tant Saree", status: "returned", amount: 1450, date: "2024-01-14", location: "Kolkata" }
];

export const clusters: ClusterData[] = [
  { id: "OD-204", name: "Cluster #OD-204", members: 8, maxMembers: 10, savings: 145, deliveryTime: "Tomorrow", status: "active", location: { lat: 12.9352, lng: 77.6245 }, completionProbability: 91, expectedTime: "1h 20m" },
  { id: "CLU-002", name: "Whitefield Cluster", members: 4, maxMembers: 8, savings: 210, deliveryTime: "3h 00m", status: "forming", location: { lat: 12.9698, lng: 77.7500 }, completionProbability: 68, expectedTime: "2h 45m" },
  { id: "CLU-003", name: "Indiranagar Hub", members: 8, maxMembers: 8, savings: 520, deliveryTime: "1h 30m", status: "completed", location: { lat: 12.9784, lng: 77.6408 }, completionProbability: 100, expectedTime: "0m" },
  { id: "CLU-004", name: "Jayanagar Block", members: 5, maxMembers: 7, savings: 280, deliveryTime: "2h 45m", status: "active", location: { lat: 12.9299, lng: 77.5838 }, completionProbability: 85, expectedTime: "1h 50m" },
  { id: "CLU-005", name: "HSR Layout Zone", members: 7, maxMembers: 8, savings: 450, deliveryTime: "1h 50m", status: "active", location: { lat: 12.9116, lng: 77.6389 }, completionProbability: 95, expectedTime: "45m" },
  { id: "CLU-006", name: "Marathahalli Cluster", members: 3, maxMembers: 6, savings: 150, deliveryTime: "4h 00m", status: "forming", location: { lat: 12.9591, lng: 77.6974 }, completionProbability: 45, expectedTime: "3h 30m" },
];

export const warehouses: WarehouseData[] = [
  { id: "WH-001", name: "Bangalore Central", location: { lat: 12.9716, lng: 77.5946 }, capacity: 50000, utilization: 78, orders: 1250, city: "Bangalore", state: "Karnataka" },
  { id: "WH-002", name: "Mumbai Thane Hub", location: { lat: 19.2183, lng: 72.9781 }, capacity: 75000, utilization: 85, orders: 2100, city: "Mumbai", state: "Maharashtra" },
  { id: "WH-003", name: "Delhi NCR Center", location: { lat: 28.4595, lng: 77.0266 }, capacity: 80000, utilization: 72, orders: 1890, city: "Gurgaon", state: "Haryana" },
  { id: "WH-004", name: "Hyderabad Logistics", location: { lat: 17.3850, lng: 78.4867 }, capacity: 45000, utilization: 65, orders: 980, city: "Hyderabad", state: "Telangana" },
  { id: "WH-005", name: "Chennai South Hub", location: { lat: 13.0827, lng: 80.2707 }, capacity: 40000, utilization: 58, orders: 720, city: "Chennai", state: "Tamil Nadu" },
  { id: "WH-006", name: "Kolkata East", location: { lat: 22.5726, lng: 88.3639 }, capacity: 35000, utilization: 62, orders: 650, city: "Kolkata", state: "West Bengal" },
  { id: "WH-007", name: "Pune Logistics Park", location: { lat: 18.5204, lng: 73.8567 }, capacity: 30000, utilization: 71, orders: 560, city: "Pune", state: "Maharashtra" },
  { id: "WH-008", name: "Bhubaneswar Center", location: { lat: 20.2961, lng: 85.8245 }, capacity: 20000, utilization: 45, orders: 320, city: "Bhubaneswar", state: "Odisha" },
];

export const drivers: DriverData[] = [
  { id: "DRV-001", name: "Rajesh Kumar", status: "active", deliveries: 12, rating: 4.8, vehicle: "EV Van", currentLocation: { lat: 12.9352, lng: 77.6245 }, fuelLevel: 72 },
  { id: "DRV-002", name: "Amit Singh", status: "active", deliveries: 8, rating: 4.6, vehicle: "Bike", currentLocation: { lat: 12.9698, lng: 77.7500 }, fuelLevel: 85 },
  { id: "DRV-003", name: "Priya Sharma", status: "idle", deliveries: 15, rating: 4.9, vehicle: "EV Van", currentLocation: { lat: 12.9784, lng: 77.6408 }, fuelLevel: 40 },
  { id: "DRV-004", name: "Mohammed Rafi", status: "active", deliveries: 10, rating: 4.7, vehicle: "Tempo", currentLocation: { lat: 19.0760, lng: 72.8777 }, fuelLevel: 55 },
  { id: "DRV-005", name: "Suresh Patel", status: "offline", deliveries: 0, rating: 4.5, vehicle: "Bike", currentLocation: { lat: 28.7041, lng: 77.1025 }, fuelLevel: 90 },
  { id: "DRV-006", name: "Deepa Nair", status: "active", deliveries: 6, rating: 4.8, vehicle: "EV Van", currentLocation: { lat: 17.3850, lng: 78.4867 }, fuelLevel: 63 },
];

export const microHubs: MicroHubData[] = [
  { id: "MH-001", name: "Koramangala Pickup Point", location: { lat: 12.9352, lng: 77.6245 }, type: "permanent", orders: 45, capacity: 100, savings: 12000, city: "Bangalore" },
  { id: "MH-002", name: "Bandra West Hub", location: { lat: 19.0596, lng: 72.8295 }, type: "temporary", orders: 30, capacity: 50, savings: 8500, city: "Mumbai" },
  { id: "MH-003", name: "Connaught Place Depot", location: { lat: 28.6315, lng: 77.2167 }, type: "permanent", orders: 55, capacity: 80, savings: 15000, city: "Delhi" },
  { id: "MH-004", name: "Cuttack Rural Hub", location: { lat: 20.4625, lng: 85.8830 }, type: "temporary", orders: 18, capacity: 30, savings: 6200, city: "Cuttack" },
  { id: "MH-005", name: "Madurai Junction", location: { lat: 9.9252, lng: 78.1198 }, type: "temporary", orders: 22, capacity: 40, savings: 7800, city: "Madurai" },
];

export const demandForecasts: DemandForecast[] = [
  { region: "Odisha", state: "Odisha", product: "Sambalpuri Sarees", currentDemand: 1200, predictedDemand: 1656, change: 38, factor: "Nuakhai Festival", confidence: 92 },
  { region: "Gujarat", state: "Gujarat", product: "Bandhani Dupattas", currentDemand: 800, predictedDemand: 1120, change: 40, factor: "Navratri Preparation", confidence: 88 },
  { region: "Tamil Nadu", state: "Tamil Nadu", product: "Kanchipuram Silks", currentDemand: 950, predictedDemand: 1235, change: 30, factor: "Pongal Season", confidence: 85 },
  { region: "Rajasthan", state: "Rajasthan", product: "Leheriya Sarees", currentDemand: 600, predictedDemand: 780, change: 30, factor: "Wedding Season", confidence: 90 },
  { region: "West Bengal", state: "West Bengal", product: "Tant Sarees", currentDemand: 1100, predictedDemand: 1540, change: 40, factor: "Durga Puja", confidence: 94 },
  { region: "Maharashtra", state: "Maharashtra", product: "Kolhapuri Chappal", currentDemand: 2200, predictedDemand: 2860, change: 30, factor: "Monsoon Season", confidence: 82 },
  { region: "Punjab", state: "Punjab", product: "Phulkari Suits", currentDemand: 750, predictedDemand: 975, change: 30, factor: "Baisakhi", confidence: 87 },
  { region: "Kerala", state: "Kerala", product: "Kasavu Mundu", currentDemand: 500, predictedDemand: 750, change: 50, factor: "Onam Festival", confidence: 91 },
];

export const alerts: AlertData[] = [
  { id: "ALT-001", type: "weather", severity: "high", title: "Heavy Rainfall Warning", description: "IMD issues heavy rain alert for coastal Odisha. Expect delivery delays of 2-4 hours.", timestamp: "2024-01-15T08:30:00", region: "Odisha" },
  { id: "ALT-002", type: "traffic", severity: "medium", title: "Traffic Congestion", description: "Major congestion on NH-48 near Bangalore. Rerouting 12 deliveries.", timestamp: "2024-01-15T09:15:00", region: "Karnataka" },
  { id: "ALT-003", type: "capacity", severity: "critical", title: "Warehouse Near Capacity", description: "Mumbai Thane Hub at 95% capacity. Immediate redistribution needed.", timestamp: "2024-01-15T07:45:00", region: "Maharashtra" },
  { id: "ALT-004", type: "driver", severity: "low", title: "Driver Availability Low", description: "Only 3 drivers available in Hyderabad zone. Consider surge allocation.", timestamp: "2024-01-15T10:00:00", region: "Telangana" },
  { id: "ALT-005", type: "route", severity: "medium", title: "Route Failure Detected", description: "Cluster CLU-006 delivery route failed. Alternate route being calculated.", timestamp: "2024-01-15T09:30:00", region: "Karnataka" },
  { id: "ALT-006", type: "cluster", severity: "low", title: "Cluster Expiring Soon", description: "Whitefield Cluster (CLU-002) expires in 45 minutes. 4 more orders needed.", timestamp: "2024-01-15T10:30:00", region: "Karnataka" },
];

export const sustainabilityMetrics: SustainabilityMetrics = {
  co2Saved: 18,
  fuelSaved: 3.4,
  distanceSaved: 148,
  moneySaved: 850,
  treesEquivalent: 587,
  tripsReduced: 3240,
  packagingOptimized: 23,
};

export const kpiData: KPIData = {
  totalOrders: 48750,
  totalSavings: 1847000,
  carbonSaved: 12847,
  deliverySuccess: 96.8,
  clusterSuccess: 89.2,
  avgDeliveryTime: "2h 34m",
  costReduction: 23.5,
  activeDrivers: 342,
  activeClusters: 156,
  activeWarehouses: 8,
};

export const sellerInventory: SellerInventory[] = [
  { id: "INV-001", product: "Sambalpuri Saree - Red", category: "Ethnic Wear", stock: 45, sold: 120, reorderLevel: 30, status: "healthy", recommendation: "Increase stock by 40% for upcoming festival" },
  { id: "INV-002", product: "Phulkari Dupatta - Multi", category: "Accessories", stock: 12, sold: 85, reorderLevel: 20, status: "low", recommendation: "Urgent restock needed - high demand expected" },
  { id: "INV-003", product: "Kolhapuri Chappal - Brown", category: "Footwear", stock: 5, sold: 200, reorderLevel: 25, status: "critical", recommendation: "Critical: Move inventory from Pune warehouse" },
  { id: "INV-004", product: "Kalamkari Kurta - Blue", category: "Ethnic Wear", stock: 80, sold: 30, reorderLevel: 20, status: "healthy", recommendation: "Reduce stock - low demand in current season" },
  { id: "INV-005", product: "Banarasi Silk - Gold", category: "Ethnic Wear", stock: 25, sold: 95, reorderLevel: 15, status: "healthy", recommendation: "Wedding season approaching - maintain current levels" },
  { id: "INV-006", product: "Ikat Print Dress", category: "Western Wear", stock: 8, sold: 150, reorderLevel: 20, status: "critical", recommendation: "Fast-moving item - immediate restock required" },
];

export const returns: ReturnData[] = [
  { id: "RET-001", orderId: "ORD-1234", reason: "Size mismatch", status: "requested", location: { lat: 12.9352, lng: 77.6245 }, savings: 45, clustered: false },
  { id: "RET-002", orderId: "ORD-1567", reason: "Color different", status: "pickup_scheduled", location: { lat: 12.9380, lng: 77.6280 }, savings: 38, clustered: true },
  { id: "RET-003", orderId: "ORD-1890", reason: "Defective product", status: "picked_up", location: { lat: 12.9320, lng: 77.6200 }, savings: 52, clustered: true },
  { id: "RET-004", orderId: "ORD-2100", reason: "Wrong item", status: "processed", location: { lat: 19.0760, lng: 72.8777 }, savings: 60, clustered: true },
  { id: "RET-005", orderId: "ORD-2345", reason: "Size mismatch", status: "requested", location: { lat: 19.0800, lng: 72.8810 }, savings: 35, clustered: false },
];

// ---------- Chart Data ----------

export const orderTrend = [
  { date: "Mon", orders: 1200, clusters: 45, savings: 15000 },
  { date: "Tue", orders: 1450, clusters: 52, savings: 18200 },
  { date: "Wed", orders: 1380, clusters: 48, savings: 16800 },
  { date: "Thu", orders: 1600, clusters: 58, savings: 21000 },
  { date: "Fri", orders: 1850, clusters: 65, savings: 25400 },
  { date: "Sat", orders: 2200, clusters: 78, savings: 32000 },
  { date: "Sun", orders: 1950, clusters: 70, savings: 28500 },
];

export const regionPerformance = [
  { region: "Karnataka", orders: 4500, savings: 180000, efficiency: 94 },
  { region: "Maharashtra", orders: 6200, savings: 248000, efficiency: 91 },
  { region: "Delhi NCR", orders: 5800, savings: 232000, efficiency: 89 },
  { region: "Tamil Nadu", orders: 3200, savings: 128000, efficiency: 92 },
  { region: "Telangana", orders: 2800, savings: 112000, efficiency: 88 },
  { region: "West Bengal", orders: 2100, savings: 84000, efficiency: 86 },
  { region: "Odisha", orders: 1500, savings: 60000, efficiency: 83 },
  { region: "Gujarat", orders: 2400, savings: 96000, efficiency: 90 },
];

export const deliveryModeBreakdown = [
  { name: "Community Delivery", value: 45, color: "#E91E8C" },
  { name: "Normal Delivery", value: 30, color: "#6366f1" },
  { name: "Express Delivery", value: 15, color: "#f59e0b" },
  { name: "Same Day", value: 10, color: "#10b981" },
];

export const monthlyRevenue = [
  { month: "Jan", revenue: 4200000, cost: 1800000, savings: 420000 },
  { month: "Feb", revenue: 3800000, cost: 1650000, savings: 380000 },
  { month: "Mar", revenue: 4500000, cost: 1900000, savings: 480000 },
  { month: "Apr", revenue: 4100000, cost: 1750000, savings: 410000 },
  { month: "May", revenue: 4800000, cost: 2000000, savings: 520000 },
  { month: "Jun", revenue: 5200000, cost: 2100000, savings: 580000 },
  { month: "Jul", revenue: 5800000, cost: 2300000, savings: 650000 },
  { month: "Aug", revenue: 5500000, cost: 2200000, savings: 610000 },
  { month: "Sep", revenue: 6200000, cost: 2400000, savings: 720000 },
  { month: "Oct", revenue: 7500000, cost: 2800000, savings: 900000 },
  { month: "Nov", revenue: 8200000, cost: 3100000, savings: 1050000 },
  { month: "Dec", revenue: 7800000, cost: 2900000, savings: 980000 },
];

export const routeComparison = {
  traditional: { cost: 950, time: "4.2 days", carbon: 7.2, distance: 82, fuel: 8, route: "Warehouse ➔ Customer A ➔ Warehouse ➔ Customer B ➔ Warehouse ➔ Customer C" },
  smartCluster: { cost: 410, time: "3.1 days", carbon: 3.0, distance: 34, fuel: 3, savings: 540, co2Red: 58, route: "Warehouse ➔ Community Cluster ➔ Customers" },
};

export const copilotSuggestions = [
  "Why is delivery delayed in Odisha?",
  "Predict tomorrow's logistics cost",
  "Which region needs another warehouse?",
  "How can delivery cost be reduced?",
  "Show me cluster performance this week",
  "Recommend micro hub locations for Tier-3 cities",
];

export const festivalCalendar = [
  { name: "Onam", region: "Kerala", date: "Aug 29", demandIncrease: 50, category: "Ethnic Wear" },
  { name: "Ganesh Chaturthi", region: "Maharashtra", date: "Sep 7", demandIncrease: 35, category: "Puja Items" },
  { name: "Durga Puja", region: "West Bengal", date: "Oct 10", demandIncrease: 60, category: "Sarees & Ethnic" },
  { name: "Diwali", region: "Pan India", date: "Nov 1", demandIncrease: 80, category: "All Categories" },
  { name: "Navratri", region: "Gujarat", date: "Oct 3", demandIncrease: 55, category: "Chaniya Choli" },
  { name: "Pongal", region: "Tamil Nadu", date: "Jan 15", demandIncrease: 40, category: "Silk Sarees" },
];

export const fleetUtilization = [
  { vehicle: "EV Vans", total: 120, active: 95, utilization: 79 },
  { vehicle: "Bikes", total: 250, active: 210, utilization: 84 },
  { vehicle: "Tempos", total: 80, active: 55, utilization: 69 },
  { vehicle: "Trucks", total: 40, active: 32, utilization: 80 },
];
