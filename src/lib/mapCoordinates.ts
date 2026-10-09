import type { Outage } from '../types';

// Fictional locations distributed across a Minneapolis-area map viewport.
// x/y are legacy schematic percentages; no real customer addresses are represented.
export function outageCoordinates(outage: Pick<Outage, 'x' | 'y'>): [number, number] {
  const west = -93.34;
  const east = -93.18;
  const north = 45.035;
  const south = 44.915;
  return [west + (outage.x / 100) * (east - west), north - (outage.y / 100) * (north - south)];
}
