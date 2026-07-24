"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons issues in Next.js
const setupLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const createCustomIcon = (color: string) => {
  return new L.DivIcon({
    html: `<span style="background-color: ${color}; width: 14px; height: 14px; display: block; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></span>`,
    className: "custom-leaflet-icon",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

export default function LeafletMapClient() {
  const [mapData, setMapData] = useState<{
    warehouses: any[];
    clusters: any[];
    microHubs: any[];
    vehicles: any[];
  }>({
    warehouses: [],
    clusters: [],
    microHubs: [],
    vehicles: [],
  });

  useEffect(() => {
    setupLeafletIcons();

    async function fetchMapData() {
      try {
        const [whRes, clRes, hubRes, flRes] = await Promise.all([
          fetch("/api/operations/warehouses"),
          fetch("/api/clusters"),
          fetch("/api/operations/microhubs"),
          fetch("/api/operations/fleet"),
        ]);

        const [whData, clData, hubData, flData] = await Promise.all([
          whRes.ok ? whRes.json() : { warehouses: [] },
          clRes.ok ? clRes.json() : { clusters: [] },
          hubRes.ok ? hubRes.json() : { microHubs: [] },
          flRes.ok ? flRes.json() : { vehicles: [] },
        ]);

        setMapData({
          warehouses: whData.warehouses || [],
          clusters: clData.clusters || [],
          microHubs: hubData.microHubs || [],
          vehicles: flData.vehicles || [],
        });
      } catch (e) {
        console.error("Error fetching leaflet map data:", e);
      }
    }

    fetchMapData();
  }, []);

  const centerLat = 12.9716;
  const centerLng = 77.5946;

  // Helper to parse location coordinates
  const parseCoordinates = (locStr: string): [number, number] => {
    if (!locStr) return [centerLat, centerLng];
    const parts = locStr.split(",").map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
    return [centerLat, centerLng];
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Warehouses Layer */}
        {mapData.warehouses.map((wh) => {
          const pos = parseCoordinates(wh.location);
          return (
            <Marker key={wh.warehouseId} position={pos} icon={createCustomIcon("var(--myntra-pink)")}>
              <Popup>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                  <strong style={{ color: "var(--myntra-pink)" }}>{wh.name}</strong>
                  <div style={{ fontSize: 11, color: "gray" }}>Warehouse ({wh.warehouseId.slice(0, 8)})</div>
                  <div style={{ marginTop: 6 }}>
                    Capacity: {wh.capacity.toLocaleString()}<br />
                    Utilization: <strong>{wh.utilization}%</strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Clusters Layer */}
        {mapData.clusters.map((clu) => {
          const pos = parseCoordinates(clu.location);
          return (
            <React.Fragment key={clu.clusterId}>
              <Marker position={pos} icon={createCustomIcon("var(--info)")}>
                <Popup>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                    <strong style={{ color: "var(--info)" }}>{clu.name}</strong>
                    <div style={{ fontSize: 11, color: "gray" }}>AI Cluster ({clu.clusterId.slice(0, 8)})</div>
                    <div style={{ marginTop: 6 }}>
                      Active Members: <strong>{clu.members}/{clu.maxMembers}</strong><br />
                      Viability Forecast: {clu.completionProbability}%
                    </div>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={pos}
                radius={1200}
                pathOptions={{ color: "var(--info)", fillColor: "var(--info)", fillOpacity: 0.15 }}
              />
            </React.Fragment>
          );
        })}

        {/* Micro Hubs */}
        {mapData.microHubs.map((hub) => {
          const pos = parseCoordinates(hub.location);
          return (
            <Marker key={hub.hubId} position={pos} icon={createCustomIcon("var(--success)")}>
              <Popup>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                  <strong style={{ color: "var(--success)" }}>{hub.name}</strong>
                  <div style={{ fontSize: 11, color: "gray" }}>Micro Hub ({hub.hubId.slice(0, 8)})</div>
                  <div style={{ marginTop: 6 }}>
                    Status: <span style={{ textTransform: "uppercase", fontWeight: 700 }}>{hub.hubType}</span><br />
                    Today&apos;s Savings: <strong>₹{hub.savings}</strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Drivers/Vehicles */}
        {mapData.vehicles.map((drv) => {
          const pos = parseCoordinates(drv.currentLocation);
          return (
            <Marker key={drv.vehicleId} position={pos} icon={createCustomIcon("var(--warning)")}>
              <Popup>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                  <strong style={{ color: "var(--warning)" }}>{drv.driver}</strong>
                  <div style={{ fontSize: 11, color: "gray" }}>Driver ({drv.vehicleId.slice(0, 8)})</div>
                  <div style={{ marginTop: 6 }}>
                    Vehicle: {drv.vehicleType}<br />
                    Rating: ⭐{drv.rating}<br />
                    Battery/Fuel: <strong>{drv.fuel}%</strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
