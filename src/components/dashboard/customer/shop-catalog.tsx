"use client";

import React, { useState, useEffect } from "react";
import { Store, ShoppingCart, Plus, Check, ArrowRight, X, Truck, Users } from "lucide-react";
import { PageId } from "@/components/layout/sidebar";

const PRODUCTS = [
  { id: 1, name: "Denim Jeans", type: "Apparel", price: "₹1,299", length_cm: 30, width_cm: 20, height_cm: 5, weight_kg: 0.5, imgUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 2, name: "Running Sneakers", type: "Footwear", price: "₹2,499", length_cm: 35, width_cm: 22, height_cm: 12, weight_kg: 0.8, imgUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 3, name: "Floral Summer Dress", type: "Apparel", price: "₹1,899", length_cm: 25, width_cm: 15, height_cm: 4, weight_kg: 0.3, imgUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=300&h=300" }, // Fixed image
  { id: 4, name: "Elegant One Piece", type: "Apparel", price: "₹2,199", length_cm: 28, width_cm: 18, height_cm: 5, weight_kg: 0.4, imgUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 5, name: "Cotton Bedsheet", type: "Home", price: "₹899", length_cm: 40, width_cm: 30, height_cm: 10, weight_kg: 1.2, imgUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 6, name: "3-Seater Fabric Sofa", type: "Furniture", price: "₹21,999", length_cm: 190, width_cm: 85, height_cm: 80, weight_kg: 45.0, imgUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 7, name: "Designer Handbag", type: "Accessories", price: "₹3,499", length_cm: 35, width_cm: 25, height_cm: 15, weight_kg: 0.6, imgUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=300&h=300" },

  { id: 8, name: "King Size Mattress", type: "Home", price: "₹14,999", length_cm: 198, width_cm: 182, height_cm: 20, weight_kg: 35.0, imgUrl: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 9, name: "Men's Formal Shirt", type: "Apparel", price: "₹1,499", length_cm: 32, width_cm: 22, height_cm: 3, weight_kg: 0.4, imgUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 10, name: "Leather Jacket", type: "Apparel", price: "₹4,999", length_cm: 40, width_cm: 30, height_cm: 10, weight_kg: 1.5, imgUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 12, name: "Yoga Mat", type: "Fitness", price: "₹699", length_cm: 60, width_cm: 15, height_cm: 15, weight_kg: 1.0, imgUrl: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 13, name: "Wooden 3-Door Wardrobe", type: "Furniture", price: "₹28,999", length_cm: 135, width_cm: 55, height_cm: 195, weight_kg: 70.0, imgUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 14, name: "Winter Beanie", type: "Accessories", price: "₹499", length_cm: 20, width_cm: 15, height_cm: 3, weight_kg: 0.1, imgUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 15, name: "Gaming Console", type: "Electronics", price: "₹45,999", length_cm: 39, width_cm: 26, height_cm: 10, weight_kg: 4.5, imgUrl: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 16, name: "Silk Saree", type: "Apparel", price: "₹5,999", length_cm: 35, width_cm: 25, height_cm: 6, weight_kg: 0.8, imgUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 17, name: "Sports Watch", type: "Accessories", price: "₹1,999", length_cm: 10, width_cm: 10, height_cm: 8, weight_kg: 0.2, imgUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 18, name: "Wooden Coffee Table", type: "Furniture", price: "₹3,299", length_cm: 90, width_cm: 50, height_cm: 45, weight_kg: 18.0, imgUrl: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 19, name: "Premium Perfume", type: "Beauty", price: "₹2,499", length_cm: 12, width_cm: 8, height_cm: 8, weight_kg: 0.4, imgUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: 21, name: "Casual T-Shirt", type: "Apparel", price: "₹599", length_cm: 25, width_cm: 20, height_cm: 2, weight_kg: 0.2, imgUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=300&h=300" }
];

export default function ShopCatalog({ onNavigate }: { onNavigate?: (pageId: PageId) => void }) {
  const [cart, setCart] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Clear cart on page refresh/mount to reset the simulation
  useEffect(() => {
    localStorage.removeItem("myntra_sim_cart");
    setCart([]);
  }, []);

  const addToCart = (product: any) => {
    const newCart = [...cart, product];
    setCart(newCart);
    localStorage.setItem("myntra_sim_cart", JSON.stringify(newCart));
  };

  const getVolume = (p: any) => ((p.length_cm * p.width_cm * p.height_cm) / 1000000).toFixed(4);
  const isHeavy = (p: any) => parseFloat(getVolume(p)) > 0.10 || p.weight_kg > 15;

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2>Shop Catalog</h2>
          <p>Browse products and add them to your cart to test the Community Delivery AI.</p>
        </div>
        
        {/* Floating Cart Widget */}
        <div style={{ background: "var(--bg-card)", padding: "16px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <ShoppingCart size={24} style={{ color: "var(--myntra-pink)" }} />
              {cart.length > 0 && (
                <div style={{ position: "absolute", top: -8, right: -8, background: "var(--myntra-pink)", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cart.length}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Your Cart</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {cart.length} {cart.length === 1 ? "Item" : "Items"} Selected
              </div>
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowModal(true)}
            disabled={cart.length === 0}
            style={{ padding: "8px 16px" }}
          >
            Checkout Simulation <ArrowRight size={14} style={{ marginLeft: 6 }} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, marginTop: 32 }}>
        {PRODUCTS.map(product => {
          const volume = getVolume(product);
          const heavy = isHeavy(product);
          const isAdded = cart.some((c) => c.id === product.id);

          return (
            <div key={product.id} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 200, background: "var(--bg-tertiary)", position: "relative" }}>
                <img src={product.imgUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {heavy && (
                  <span className="badge" style={{ position: "absolute", top: 12, left: 12, background: "var(--myntra-pink)", color: "#fff", fontWeight: 700, padding: "4px 8px", borderRadius: 4, backdropFilter: "blur(4px)" }}>
                    Heavy Freight
                  </span>
                )}
              </div>
              
              <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>{product.type}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 4, marginBottom: 8, color: "var(--text-primary)" }}>{product.name}</h3>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>{product.price}</div>
                  
                  <div style={{ background: "var(--bg-tertiary)", padding: 12, borderRadius: "var(--radius-sm)", marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600, marginBottom: 4 }}>PHYSICAL DIMENSIONS</div>
                    <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
                      {product.length_cm} × {product.width_cm} × {product.height_cm} cm
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Vol: <strong>{volume} m³</strong></div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Wt: <strong>{product.weight_kg} kg</strong></div>
                    </div>
                  </div>
                </div>

                {isAdded ? (
                  <button 
                    className="btn" 
                    style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "not-allowed" }}
                    disabled
                  >
                    <Check size={16} style={{ marginRight: 6 }} /> Already Added
                  </button>
                ) : (
                  <button 
                    className="btn" 
                    style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--myntra-pink)", color: "var(--myntra-pink)" }}
                    onClick={() => addToCart(product)}
                  >
                    <Plus size={16} style={{ marginRight: 6 }} /> Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card animate-fade-in" style={{ width: 600, maxWidth: "100%", position: "relative", background: "var(--bg-primary)", border: "1px solid var(--border)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)" }}>
              <X size={20} />
            </button>
            <div className="card-header" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, color: "var(--text-primary)" }}>Select Delivery Method</h3>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Standard Delivery Option */}
              <div 
                style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 20, cursor: "pointer", transition: "all 0.2s ease" }}
                onClick={() => onNavigate && onNavigate("standard-checkout")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ background: "var(--bg-tertiary)", padding: 10, borderRadius: "50%" }}>
                    <Truck size={24} style={{ color: "var(--text-secondary)" }} />
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Standard Delivery</h4>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
                  Individual delivery via standard carrier. Typical delivery in 3-5 days.
                </p>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Shipping: ₹99</div>
                <button className="btn" style={{ width: "100%", marginTop: 16, background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
                  Select Standard
                </button>
              </div>

              {/* Community Delivery Option */}
              <div 
                style={{ border: "2px solid var(--myntra-pink)", borderRadius: "var(--radius-md)", padding: 20, cursor: "pointer", background: "rgba(233, 30, 140, 0.05)", position: "relative", overflow: "hidden" }}
                onClick={() => onNavigate && onNavigate("community")}
              >
                <div style={{ position: "absolute", top: 0, right: 0, background: "var(--myntra-pink)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderBottomLeftRadius: 8 }}>
                  RECOMMENDED
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ background: "var(--myntra-pink)", padding: 10, borderRadius: "50%" }}>
                    <Users size={24} style={{ color: "#fff" }} />
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--myntra-pink)" }}>Community Delivery</h4>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
                  AI-powered route pooling with neighbors. Save money and reduce carbon emissions!
                </p>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--success)" }}>Shipping: FREE target</div>
                <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }}>
                  Select Community
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
