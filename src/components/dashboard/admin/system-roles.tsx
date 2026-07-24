"use client";

import React, { useState } from "react";
import { Shield, Users, Plus, Trash2, Edit } from "lucide-react";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Seller" | "Operations" | "Delivery Partner";
  status: "Active" | "Inactive";
  permissions: string[];
}

const initialUsers: UserAccount[] = [
  { id: "USR-001", name: "Anish Gupta", email: "anish.gupta@myntra.com", role: "Operations", status: "Active", permissions: ["View Dashboard", "Reroute Shipments", "Manage Drivers"] },
  { id: "USR-002", name: "Aanya Boutiques", email: "contact@aanya.seller.com", role: "Seller", status: "Active", permissions: ["View Analytics", "Manage Stock", "Request AI Insight"] },
  { id: "USR-003", name: "Delhivery Logistics", email: "fleet@delhivery.com", role: "Delivery Partner", status: "Active", permissions: ["Accept Clusters", "View Routes"] },
  { id: "USR-004", name: "Priya Sharma", email: "priya.sharma@gmail.com", role: "Customer", status: "Active", permissions: ["Place Orders", "Join Community", "Choose Slot"] }
];

export default function SystemRoles() {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserAccount["role"]>("Customer");
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!name || !email) return;
    const newUser: UserAccount = {
      id: `USR-0${users.length + 1}`,
      name,
      email,
      role,
      status: "Active",
      permissions: role === "Operations" ? ["View Dashboard", "Reroute Shipments"]
                 : role === "Seller" ? ["View Analytics", "Manage Stock"]
                 : role === "Delivery Partner" ? ["Accept Clusters"]
                 : ["Place Orders", "Join Community"]
    };
    setUsers([...users, newUser]);
    setName("");
    setEmail("");
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h2>User Management & Access Control</h2>
        <p>Manage workspace user accounts, access roles, and system permission levels</p>
      </div>

      <div>
        {/* User Role CRUD */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="card-title"><Users size={16} style={{ marginRight: 6, display: "inline" }} /> Account List & Roles</div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Plus size={14} /> Add Account
            </button>
          </div>

          {showAdd && (
            <div style={{ display: "flex", gap: 12, marginBottom: 20, padding: 14, borderRadius: 8, background: "var(--bg-tertiary)", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>Name</span>
                <input value={name} onChange={e => setName(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 12 }} placeholder="e.g. John Doe" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>Email</span>
                <input value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 12 }} placeholder="e.g. email@myntra.com" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>Role</span>
                <select value={role} onChange={e => setRole(e.target.value as any)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 12 }}>
                  <option value="Customer">Customer</option>
                  <option value="Seller">Seller</option>
                  <option value="Operations">Operations</option>
                  <option value="Delivery Partner">Delivery Partner</option>
                </select>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleAdd}>Save</button>
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid var(--border)", color: "var(--text-tertiary)" }}>
                  <th style={{ padding: 10 }}>User Details</th>
                  <th style={{ padding: 10 }}>Role</th>
                  <th style={{ padding: 10 }}>Permissions</th>
                  <th style={{ padding: 10 }}>Status</th>
                  <th style={{ padding: 10, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{u.email} · ID: {u.id}</div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span className={`badge ${u.role === "Operations" ? "pink" : u.role === "Seller" ? "blue" : u.role === "Delivery Partner" ? "orange" : "green"}`}>{u.role}</span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {u.permissions.map((p, i) => (
                          <span key={i} style={{ fontSize: 9.5, padding: "2px 6px", borderRadius: 4, background: "var(--border)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>{p}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{ fontSize: 11, color: "#00D084", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00D084" }} />
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: "right" }}>
                      <button className="btn btn-secondary btn-sm" style={{ marginRight: 6, padding: 5 }}><Edit size={12} /></button>
                      <button className="btn btn-secondary btn-sm" style={{ color: "#FF5A5A", padding: 5 }} onClick={() => handleDelete(u.id)}><Trash2 size={12} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
