"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Component to dynamically fit bounds of route
function FitBounds({ route }: { route: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      const bounds = route.map(p => [p.lat, p.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  return null;
}

export default function RouteMap({ route, type }: { route: any[], type: "traditional" | "optimized" }) {
  if (!route || route.length === 0) return <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading map...</div>;

  const color = type === "traditional" ? "#FF5A5A" : "#00D084";
  const positions = route.map(p => [p.lat, p.lng] as [number, number]);

  return (
    <div style={{ width: "100%", height: 280, position: "relative", zIndex: 1, borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <style>
        {`
          .leaflet-tile-pane {
            filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
          }
          .leaflet-container {
            background: #0f172a !important; 
          }
        `}
      </style>
      <MapContainer 
        center={positions[0]} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds route={route} />
        
        {/* Draw the Route Line */}
        <Polyline 
          positions={positions} 
          pathOptions={{ 
            color: color, 
            weight: 3, 
            dashArray: type === "traditional" ? "8, 8" : undefined,
            opacity: 0.8
          }} 
        />

        {/* Draw the Points */}
        {route.map((p, idx) => {
          // Avoid redrawing duplicates (like returning to warehouse)
          if (idx > 0 && p.id === route[0].id) return null;
          
          let pColor = color;
          if (p.type === "warehouse") pColor = "#6C63FF"; // Purple for warehouse
          if (p.type === "hub") pColor = "#FFB547"; // Orange for micro hub

          return (
            <CircleMarker
              key={`${p.id}-${idx}`}
              center={[p.lat, p.lng]}
              radius={p.type === "warehouse" ? 8 : 5}
              pathOptions={{ fillColor: pColor, color: "#fff", weight: 2, fillOpacity: 1 }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                <div style={{ fontWeight: "bold", fontSize: 11, color: "#333" }}>{p.name}</div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
