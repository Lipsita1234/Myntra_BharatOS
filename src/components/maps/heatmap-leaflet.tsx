"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
const setupLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const INDIA_BOUNDS = L.latLngBounds(
  L.latLng(6.75, 68.16),
  L.latLng(35.5, 97.4)
);

export default function HeatmapLeaflet({ 
  mapData, 
  selectedState, 
  setSelectedState 
}: { 
  mapData: any[], 
  selectedState: any, 
  setSelectedState: (s: any) => void 
}) {
  useEffect(() => {
    setupLeafletIcons();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)" }}>
      <style>{`
        html.dark .leaflet-layer {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={4}
        minZoom={4}
        maxBounds={INDIA_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapData.map((blob, idx) => {
          if (!blob.lat || !blob.lng) return null;
          const isSelected = selectedState?.name === blob.name;

          return (
            <CircleMarker
              key={idx}
              center={[blob.lat, blob.lng]}
              radius={isSelected ? 6 : 4}
              pathOptions={{
                color: isSelected ? "white" : blob.color,
                fillColor: blob.color,
                fillOpacity: 0.6,
                weight: isSelected ? 2 : 0
              }}
              eventHandlers={{
                click: () => {
                  setSelectedState(mapData[blob.idx]);
                },
              }}
            >
              <Popup>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{blob.name}</div>
                <div style={{ fontSize: 11, color: "gray" }}>Orders: {blob.orders.toLocaleString()}</div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
