import fs from "fs";
import path from "path";
import { JWTPayload } from "./jwt";

const DB_FILE = path.join(process.cwd(), "src", "lib", "mock-db-file.json");

// Helper to load db
function readDb(): any {
  if (!fs.existsSync(DB_FILE)) {
    // Write default initial mock data
    const initialData = {
      users: [
        { userId: "USR-ADMIN", name: "Executive Admin", email: "admin@myntra.com", password: "password123", role: "admin" },
        { userId: "USR-OPS", name: "Priya Sharma", email: "ops@myntra.com", password: "password123", role: "operations" },
        { userId: "USR-SELLER", name: "Saree World", email: "seller@myntra.com", password: "password123", role: "seller" },
        { userId: "USR-CUST", name: "Anish Gupta", email: "customer@myntra.com", password: "password123", role: "customer" },
      ],
      orders: [],
      clusters: [],
      notifications: [],
      deliveryModes: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { users: [], orders: [], clusters: [], notifications: [], deliveryModes: {} };
  }
}

// Helper to write db
function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

export const dbMock = {
  getUsers: () => readDb().users,
  addUser: (user: any) => {
    const db = readDb();
    db.users.push(user);
    writeDb(db);
  },
  findUserByEmail: (email: string) => {
    const users = readDb().users;
    return users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById: (id: string) => {
    const users = readDb().users;
    return users.find((u: any) => u.userId === id);
  },
  
  getOrders: () => readDb().orders,
  addOrder: (order: any) => {
    const db = readDb();
    db.orders.push(order);
    writeDb(db);
  },
  
  getClusters: () => readDb().clusters,
  addCluster: (cluster: any) => {
    const db = readDb();
    db.clusters.push(cluster);
    writeDb(db);
  },
  updateCluster: (id: string, updates: any) => {
    const db = readDb();
    db.clusters = db.clusters.map((c: any) => c.id === id ? { ...c, ...updates } : c);
    writeDb(db);
  },
  deleteCluster: (id: string) => {
    const db = readDb();
    db.clusters = db.clusters.filter((c: any) => c.id !== id);
    writeDb(db);
  },

  getNotifications: () => readDb().notifications,
  addNotification: (notif: any) => {
    const db = readDb();
    db.notifications.push(notif);
    writeDb(db);
  },

  getDeliveryModes: () => readDb().deliveryModes,
  setDeliveryMode: (userId: string, mode: string) => {
    const db = readDb();
    db.deliveryModes[userId] = mode;
    writeDb(db);
  }
};
