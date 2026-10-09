export type Severity = 'Critical' | 'High' | 'Moderate' | 'Low';
export type Status = 'Active' | 'Investigating' | 'Crew Dispatched' | 'Resolved';
export type Cause = 'Equipment failure' | 'Weather' | 'Vegetation' | 'Unknown' | 'Scheduled maintenance';

export interface Outage {
  id: string;
  area: string;
  address: string;
  reportedAt: string;
  customers: number;
  severity: Severity;
  status: Status;
  cause: Cause;
  crew: string;
  estimatedRestoration: string;
  x: number;
  y: number;
  notes: string;
}
