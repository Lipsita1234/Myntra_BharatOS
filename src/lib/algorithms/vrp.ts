/**
 * Vehicle Routing Problem (VRP) Heuristic (Nearest Neighbor)
 */

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export interface Node {
  id: string;
  lat: number;
  lng: number;
  demand?: number;
  volume?: number;
}

export interface RouteResult {
  vehicleId: string;
  path: Node[];
  totalDistance: number;
}

/**
 * Optimizes routes for multiple vehicles starting from a depot.
 */
export function optimizeRoutes(depot: Node, points: Node[], vehicles: { id: string, capacity: number, maxVolume?: number }[]): RouteResult[] {
  const unvisited = [...points];
  const routes: RouteResult[] = [];

  for (const vehicle of vehicles) {
    if (unvisited.length === 0) break;

    const path: Node[] = [depot];
    let currentCapacity = vehicle.capacity;
    let currentVolume = vehicle.maxVolume ?? Infinity;
    let currentLoc = depot;
    let totalDistance = 0;

    while (unvisited.length > 0 && currentCapacity > 0) {
      // Find nearest neighbor
      let nearestIdx = -1;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const p = unvisited[i];
        if ((p.demand || 1) <= currentCapacity && (p.volume || 0) <= currentVolume) {
          const dist = getDistance(currentLoc.lat, currentLoc.lng, p.lat, p.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestIdx = i;
          }
        }
      }

      if (nearestIdx === -1) {
        // No unvisited node fits in remaining capacity
        break;
      }

      const nextNode = unvisited[nearestIdx];
      path.push(nextNode);
      totalDistance += minDistance;
      currentCapacity -= (nextNode.demand || 1);
      currentVolume -= (nextNode.volume || 0);
      currentLoc = nextNode;
      unvisited.splice(nearestIdx, 1);
    }

    // Return to depot
    totalDistance += getDistance(currentLoc.lat, currentLoc.lng, depot.lat, depot.lng);
    path.push(depot);

    routes.push({
      vehicleId: vehicle.id,
      path,
      totalDistance
    });
  }

  return routes;
}
