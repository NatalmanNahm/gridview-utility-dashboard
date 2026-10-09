import type { Outage } from '../types';
import { seedOutages } from '../data/outages';

const KEY = 'gridview-outages-v1';

export function loadOutages(): Outage[] {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return seedOutages;
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.every(item => typeof item?.id === 'string' && typeof item?.status === 'string')
      ? parsed as Outage[]
      : seedOutages;
  } catch {
    return seedOutages;
  }
}

export function saveOutages(outages: Outage[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(outages)); } catch { /* storage unavailable */ }
}

export function resetOutages(): Outage[] {
  try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
  return seedOutages;
}
