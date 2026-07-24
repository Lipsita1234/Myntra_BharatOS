"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const statusConfig: Record<string, { color: string; badge: string; label: string; dot: string }> = {
  completed: { color: "#00D084", badge: "green", label: "✅ Completed", dot: "#00D084" },
  active:    { color: "#00C2FF", badge: "blue",  label: "🚀 Ready for Dispatch", dot: "#00C2FF" },
  forming:   { color: "#FFB547", badge: "orange", label: "🔄 Forming", dot: "#FFB547" },
  delayed:   { color: "#FF5A5A", badge: "red",   label: "⚠️ Delayed", dot: "#FF5A5A" },
};

export default function LiveMap({ 
  clusters, 
  selected, 
  onSelect 
}: { 
  clusters: any[]; 
  selected: any; 
  onSelect: (c: any) => void; 
}) {
  // Center map on India roughly
  const center: [number, number] = [22.5937, 78.9629];
  const zoom = 4.5;

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", position: "relative", zIndex: 1 }}>
      <style>
        {`
          .leaflet-tile-pane {
            filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
          }
          .leaflet-container {
            background: #0f172a !important; /* Tailwind slate-900 */
          }
        `}
      </style>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {clusters.map((cl) => {
          if (!cl.lat || !cl.lng) return null;
          
          const cfg = statusConfig[cl.status] || statusConfig.forming;
          const isSelected = selected?.id === cl.id;
          
          return (
            <CircleMarker
              key={cl.id}
              center={[cl.lat, cl.lng]}
              pathOptions={{
                color: isSelected ? "#fff" : cfg.color,
                fillColor: cfg.color,
                fillOpacity: isSelected ? 1 : 0.8,
                weight: isSelected ? 2 : 1,
              }}
              radius={isSelected ? 8 : 5}
              eventHandlers={{
                click: () => onSelect(cl),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div style={{ padding: "4px", fontSize: "12px", fontWeight: "bold", color: "#334155" }}>
                  {cl.location} - {cfg.label}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
