"use client";

import React, { useState, useEffect } from "react";
import { Users, Timer, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import DeliveryPriority from "./delivery-priority";

export default function CommunityDelivery() {
  const [timeLeft, setTimeLeft] = useState(8040); // Will sync with end of day
  const [cluster, setCluster] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Load cart from local storage
  useEffect(() => {
    const saved = localStorage.getItem("myntra_sim_cart");
    if (saved) {
      try { setCartItems(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const calculateCartMetrics = (items: any[]) => {
    let total_cart_volume_m3 = 0;
    items.forEach(item => {
      total_cart_volume_m3 += (item.length_cm * item.width_cm * item.height_cm) / 1000000;
    });
    total_cart_volume_m3 = parseFloat(total_cart_volume_m3.toFixed(4));
    const cart_capacity_impact_pct = Math.round((total_cart_volume_m3 / 1.20) * 100);
    return { total_cart_volume_m3, cart_capacity_impact_pct };
  };

  const { total_cart_volume_m3, cart_capacity_impact_pct } = calculateCartMetrics(cartItems);
  const standardItems = cartItems.filter(item => (item.length_cm * item.width_cm * item.height_cm)/1000000 <= 0.10);
  const oversizedItems = cartItems.filter(item => (item.length_cm * item.width_cm * item.height_cm)/1000000 > 0.10);
  const stdMetrics = calculateCartMetrics(standardItems);

  useEffect(() => {
    // Sync timer to midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    setTimeLeft(Math.floor((midnight.getTime() - now.getTime()) / 1000));

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 86400));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCluster = async () => {
      try {
        const res = await fetch("/api/customer/clusters");
        if (res.ok) {
          const data = await res.json();
          const forming = data.clusters[0];
          setCluster(forming || null);
        }
      } catch (error) {
        console.error("Failed to fetch cluster", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCluster();
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} Hours ${mins} Minutes ${secs} Seconds`;
  };

  const placeGroupOrder = async () => {
    if (!cluster) return;
    setIsPlacing(true);
    
    try {
      const res = await fetch("/api/customer/join-cluster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          clusterId: cluster.clusterId,
          cart_volume_m3: total_cart_volume_m3,
          is_oversized: cartItems.some(item => (item.length_cm * item.width_cm * item.height_cm)/1000000 > 0.10)
        })
      });
      
      const data = await res.json();

      if (res.ok) {
        setHasJoined(true);
        setJoinError(data.routed_via_heavy_freight ? "Note: Your oversized item was routed via Heavy Freight." : "");
        if (data.cluster) {
          setCluster(data.cluster);
        }

      } else {
        setJoinError(data.error || "Failed to join. Try again.");
      }
    } catch (error) {
      setJoinError("Network error.");
    } finally {
      setIsPlacing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        Loading community data...
      </div>
    );
  }

  const currentMembers = cluster?.members || 0;
  const capacityPct = cluster?.capacity_percentage || 0;
  const spotsLeft = cluster?.estimated_apparel_spots_left || 10;
  const remaining = Math.max(0, 14 - currentMembers);
  const isFull = capacityPct >= 90;

  return (
    <div>
      <div className="page-header">
        <h2>Community Delivery Window</h2>
        <p>Unlock free delivery by coordinating with orders in your neighborhood</p>
      </div>

      {/* Cart to Cluster Checkout Simulator */}
      {!hasJoined ? (
        cartItems.length > 0 ? (
          <div className="card" style={{ marginBottom: 24, border: "2px solid var(--myntra-pink)" }}>
            <div className="card-header">
              <div className="card-title" style={{ color: "var(--myntra-pink)" }}>Checkout: Select Delivery Option</div>
              <span className="badge pink">Recommended</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Community Route-Pool (AI Cluster)</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Your cart occupies {total_cart_volume_m3} m³ and will add +{cart_capacity_impact_pct}% capacity to your local cluster!
                </div>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 8 }}>
                  Items: {cartItems.map(i => i.name).join(", ")}
                </div>
              </div>
              <button className="btn btn-primary" onClick={placeGroupOrder} disabled={isPlacing || isFull}>
                {isPlacing ? "Joining..." : "Place Group Order"}
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ marginBottom: 24, background: "var(--bg-tertiary)", textAlign: "center", padding: 32, border: "1px dashed var(--border)" }}>
            <h3 style={{ color: "var(--text-primary)", fontSize: 18, marginBottom: 8 }}>Your Cart is Empty</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Navigate to the <strong>Shop Catalog</strong> on the left sidebar to add products and test the AI Community Delivery simulator.</p>
          </div>
        )
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          {standardItems.length > 0 && (
            <div className="card" style={{ background: "rgba(20, 164, 77, 0.05)", border: "1px solid var(--success)" }}>
              <div className="card-header">
                <div className="card-title" style={{ color: "var(--success)" }}>Track 1: Community Delivery</div>
                <span className="badge green">#MYN-88219-A</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{standardItems.length} Standard Items</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    Occupies {stdMetrics.total_cart_volume_m3} m³ / +{stdMetrics.cart_capacity_impact_pct}% Fleet Space
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 8 }}>
                    {standardItems.map(i => i.name).join(", ")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--success)" }}>₹19</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Current Fee (FREE at 85% capacity)</div>
                </div>
              </div>
            </div>
          )}

          {oversizedItems.length > 0 && (
            <div className="card" style={{ background: "rgba(233, 30, 140, 0.05)", border: "1px solid var(--myntra-pink)" }}>
              <div className="card-header">
                <div className="card-title" style={{ color: "var(--myntra-pink)" }}>Track 2: Heavy Freight</div>
                <span className="badge pink">#MYN-88219-B</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{oversizedItems.length} Oversized Items</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    Routed via Heavy Freight (Exceeds micro-EV capacity)
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 8 }}>
                    {oversizedItems.map(i => i.name).join(", ")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--myntra-pink)" }}>₹299</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Fixed Heavy Freight Fee</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid-cols-2" style={{ marginBottom: 24 }}>
        {/* Main Status */}
        <div className="card-glass relative overflow-hidden" style={{ minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Users size={120} color="var(--myntra-pink)" />
          </div>

          <div>
            <span className="badge pink" style={{ marginBottom: 12 }}>
              <Sparkles size={12} style={{ marginRight: 4 }} /> Near You Active
            </span>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "var(--text-primary)" }}>
              {capacityPct}% of your local delivery fleet is already filled.
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: "90%" }}>
              Only <strong style={{ color: "var(--myntra-pink)" }}>~{spotsLeft} more standard fashion parcels</strong> are needed to lock this cluster and unlock <strong>FREE DELIVERY</strong>.
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ margin: "24px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
              <span>Community Progress</span>
              <span>{capacityPct}% Fleet Capacity Filled</span>
            </div>
            <div className="progress-bar" style={{ height: 12 }}>
              <div className="progress-fill" style={{ width: `${capacityPct}%` }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 8 }}>
              Space remaining for ~{spotsLeft} standard apparel parcels ({cluster?.current_volume_m3?.toFixed(2) || 0} / {cluster?.fleet_max_volume_m3 || 1.20} m³ loaded)
            </div>
          </div>

          {/* Countdown & CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Timer size={18} className="pulse-glow" style={{ color: "var(--myntra-pink)", borderRadius: "50%" }} />
              <div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                  {remaining === 0 ? "Cluster Complete" : "Community Window Closing In"}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: remaining === 0 ? "var(--success)" : "inherit" }}>
                  {remaining === 0 ? "00:00:00" : formatTime(timeLeft)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              {/* Button moved to checkout simulator */}
              {joinError && <span style={{ fontSize: 11, color: "var(--error)", marginTop: 4 }}>{joinError}</span>}
            </div>
          </div>
        </div>

        {/* Dynamic Shipping Reduction */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Dynamic Shipping Cost Reduction</div>
            <HelpCircle size={16} style={{ color: "var(--text-tertiary)", cursor: "pointer" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { level: "1-3 Orders", cost: "₹99", status: "standard", desc: "Individual deliveries separate schedules" },
              { level: "4-5 Orders", cost: "₹49", status: "discounted", desc: "Basic route clustering active" },
              { level: "6-7 Orders", cost: "₹19", status: "highly-discounted", desc: "Optimized micro-hub grouping" },
              { level: "8+ Orders", cost: "FREE", status: "free", highlight: true, desc: "Maximum sustainability logistics achieved" },
            ].map((step, idx) => {
               // Highlight logic based on current members
               let isActive = false;
               if (idx === 0 && currentMembers <= 3) isActive = true;
               if (idx === 1 && currentMembers > 3 && currentMembers <= 5) isActive = true;
               if (idx === 2 && currentMembers > 5 && currentMembers <= 7) isActive = true;
               if (idx === 3 && currentMembers >= 8) isActive = true;
               
               return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: isActive ? "1.5px solid var(--myntra-pink)" : "1px solid var(--border)",
                    background: isActive ? "var(--primary-muted)" : "transparent",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? "var(--myntra-pink)" : "var(--text-primary)" }}>
                      {step.level}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{step.desc}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: isActive ? "var(--success)" : "var(--text-primary)" }}>
                      {step.cost}
                    </span>
                    {isActive && <span style={{ fontSize: 10, color: "var(--success)", fontWeight: 600 }}>Active Tier Target</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      
      {/* Informational Delivery Priority Simulator */}
      <DeliveryPriority />

      <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(233, 30, 140, 0.05)", border: "1px dashed var(--myntra-pink)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-secondary)" }}>
        <strong>⚡ Note:</strong> Items {'>'} 15kg / 0.1 m³ (e.g. appliances) automatically bypass micro-EV pools to Heavy Freight.
      </div>
    </div>
  );
}
