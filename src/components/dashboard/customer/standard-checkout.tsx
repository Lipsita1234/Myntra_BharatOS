"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, CreditCard, Truck, MapPin, Package } from "lucide-react";

export default function StandardCheckout() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("myntra_sim_cart");
    if (saved) {
      try { setCartItems(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const total = cartItems.reduce((acc, item) => {
    const p = parseFloat(item.price.replace("₹", "").replace(",", ""));
    return acc + p;
  }, 0);

  const shippingFee = 99;
  const grandTotal = total + shippingFee;

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    setTimeout(() => {
      setIsPlacing(false);
      setIsPlaced(true);
      // Clear cart
      localStorage.removeItem("myntra_sim_cart");
    }, 1500);
  };

  if (isPlaced) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <CheckCircle2 size={80} style={{ color: "var(--success)", marginBottom: 24 }} />
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: "var(--text-primary)" }}>Order Placed Successfully!</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 32, textAlign: "center", maxWidth: 400 }}>
          Your standard delivery order has been confirmed. It will arrive in 3-5 business days.
        </p>
        <div className="card" style={{ width: 400, maxWidth: "100%", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 16 }}>
            <span style={{ color: "var(--text-secondary)" }}>Order Number</span>
            <strong style={{ color: "var(--text-primary)" }}>#MYN-STD-{Math.floor(Math.random() * 100000)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "var(--text-secondary)" }}>Items ({cartItems.length})</span>
            <strong style={{ color: "var(--text-primary)" }}>₹{total.toLocaleString()}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
            <strong style={{ color: "var(--text-primary)" }}>₹{shippingFee}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            <strong style={{ color: "var(--text-primary)", fontSize: 18 }}>Total Paid</strong>
            <strong style={{ color: "var(--success)", fontSize: 18 }}>₹{grandTotal.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Standard Checkout</h2>
        <p>Complete your standard delivery order</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Shipping Address */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={18} /> Shipping Address
              </div>
            </div>
            <div style={{ padding: 16, border: "1px solid var(--myntra-pink)", borderRadius: "var(--radius-md)", background: "rgba(233, 30, 140, 0.05)" }}>
              <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--text-primary)" }}>Priya Sharma</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                123 Tech Park Road, Block C<br />
                Koramangala, Bengaluru<br />
                Karnataka, 560034<br />
                Phone: +91 98765 43210
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CreditCard size={18} /> Payment Method
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer" }}>
                <input type="radio" name="payment" defaultChecked style={{ accentColor: "var(--myntra-pink)" }} />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Credit / Debit Card</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Visa ending in 4242</div>
                </div>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer" }}>
                <input type="radio" name="payment" style={{ accentColor: "var(--myntra-pink)" }} />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>UPI</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Google Pay, PhonePe, Paytm</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card" style={{ position: "sticky", top: 24 }}>
            <div className="card-header">
              <div className="card-title">Order Summary</div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24, maxHeight: 300, overflowY: "auto" }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12 }}>
                  <img src={item.imgUrl} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Qty: 1</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", marginTop: 4 }}>{item.price}</div>
                  </div>
                </div>
              ))}
              {cartItems.length === 0 && (
                <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>Your cart is empty.</div>
              )}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: 14 }}>
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: 14 }}>
                <span>Standard Delivery</span>
                <span>₹{shippingFee}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, color: "var(--text-primary)", marginTop: 8, paddingTop: 8, borderTop: "1px dashed var(--border)" }}>
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: "100%", padding: 14, fontSize: 16 }}
              onClick={handlePlaceOrder}
              disabled={isPlacing || cartItems.length === 0}
            >
              {isPlacing ? "Processing Payment..." : "Pay & Place Order"}
            </button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, color: "var(--text-tertiary)", fontSize: 11 }}>
              <Package size={12} /> Delivery expected in 3-5 days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
