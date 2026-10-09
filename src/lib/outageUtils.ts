import type { Outage, Severity, Status } from '../types';

export const severityOrder: Record<Severity, number> = { Critical: 0, High: 1, Moderate: 2, Low: 3 };
export const statuses: Status[] = ['Active', 'Investigating', 'Crew Dispatched', 'Resolved'];

export function filterOutages(outages: Outage[], search: string, status: string, severity: string): Outage[] {
  const term = search.trim().toLowerCase();
  return outages.filter(o => {
    const matchesText = !term || [o.id, o.area, o.address, o.cause, o.crew].some(value => value.toLowerCase().includes(term));
    return matchesText && (status === 'All statuses' || o.status === status) && (severity === 'All severities' || o.severity === severity);
  });
}

export function summarizeOutages(outages: Outage[]) {
  const active = outages.filter(o => o.status !== 'Resolved');
  return {
    activeCount: active.length,
    customersAffected: active.reduce((sum, o) => sum + o.customers, 0),
    crewsDispatched: active.filter(o => o.status === 'Crew Dispatched').length,
    resolvedCount: outages.filter(o => o.status === 'Resolved').length
  };
}

export function sortOutages(outages: Outage[], sort: string): Outage[] {
  return [...outages].sort((a,b) => {
    if (sort === 'severity') return severityOrder[a.severity] - severityOrder[b.severity];
    if (sort === 'customers') return b.customers - a.customers;
    if (sort === 'area') return a.area.localeCompare(b.area);
    return b.reportedAt.localeCompare(a.reportedAt);
  });
}

export function exportCsv(outages: Outage[]): string {
  const fields: (keyof Outage)[] = ['id','area','address','status','severity','customers','cause','crew','reportedAt'];
  const quote = (value: unknown) => `"${String(value).replaceAll('"', '""')}"`;
  return [fields.join(','), ...outages.map(o => fields.map(f => quote(o[f])).join(','))].join('\r\n');
}
