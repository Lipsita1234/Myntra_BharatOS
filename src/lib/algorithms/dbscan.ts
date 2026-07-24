/**
 * Native TypeScript implementation of DBSCAN for spatial clustering.
 */

// Haversine formula to calculate distance between two coordinates in kilometers
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export interface Point {
  id: string;
  lat: number;
  lng: number;
  volume?: number;
  [key: string]: any;
}

export interface ClusterOutput {
  id: string;
  points: Point[];
  centroid: { lat: number, lng: number };
  volume?: number;
}

export function runDBSCAN(points: Point[], epsKm: number, minPts: number, maxVolume?: number): ClusterOutput[] {
  const visited = new Set<string>();
  const clustered = new Set<string>();
  const clusters: ClusterOutput[] = [];
  let clusterIdCounter = 1;

  function regionQuery(p: Point): Point[] {
    return points.filter(otherP => getDistanceFromLatLonInKm(p.lat, p.lng, otherP.lat, otherP.lng) <= epsKm);
  }

  for (const point of points) {
    // We only skip if already clustered. If visited but not clustered, it might have been rejected
    // from a previous cluster due to volume limits, so we give it a chance to form its own cluster.
    if (clustered.has(point.id)) continue;
    visited.add(point.id);

    const initialVolume = point.volume || 0;
    if (maxVolume !== undefined && initialVolume > maxVolume) {
      continue; // Item itself exceeds capacity
    }

    const neighbors = regionQuery(point);
    if (neighbors.length < minPts) {
      // Noise point
      continue;
    }

    const currentClusterPoints: Point[] = [point];
    let currentVolume = initialVolume;
    clustered.add(point.id);

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        const neighborNeighbors = regionQuery(neighbor);
        if (neighborNeighbors.length >= minPts) {
          neighbors.push(...neighborNeighbors.filter(nn => !neighbors.some(n => n.id === nn.id)));
        }
      }
      if (!clustered.has(neighbor.id)) {
        const nVolume = neighbor.volume || 0;
        if (maxVolume !== undefined && currentVolume + nVolume > maxVolume) {
          continue; // Skip adding to this cluster to respect capacity constraint
        }
        currentClusterPoints.push(neighbor);
        currentVolume += nVolume;
        clustered.add(neighbor.id);
      }
    }

    // Calculate centroid
    const sumLat = currentClusterPoints.reduce((sum, p) => sum + p.lat, 0);
    const sumLng = currentClusterPoints.reduce((sum, p) => sum + p.lng, 0);

    clusters.push({
      id: `C${Date.now()}-${clusterIdCounter++}`,
      points: currentClusterPoints,
      centroid: {
        lat: sumLat / currentClusterPoints.length,
        lng: sumLng / currentClusterPoints.length
      },
      volume: currentVolume
    });
  }

  return clusters;
}
