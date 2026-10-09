import { describe, expect, it } from 'vitest';
import { seedOutages } from '../data/outages';
import { exportCsv, filterOutages, sortOutages, summarizeOutages } from '../lib/outageUtils';

describe('outage utilities', () => {
  it('excludes resolved customers from active totals', () => {
    const summary = summarizeOutages(seedOutages);
    expect(summary.activeCount).toBe(7);
    expect(summary.resolvedCount).toBe(3);
    expect(summary.customersAffected).toBe(1161);
  });
  it('filters by location, status and severity', () => {
    expect(filterOutages(seedOutages, 'North Loop', 'Active', 'Critical').map(o => o.id)).toEqual(['OUT-1042']);
    expect(filterOutages(seedOutages, 'North Loop', 'Resolved', 'Critical')).toHaveLength(0);
  });
  it('sorts without mutating original input', () => {
    const original = [...seedOutages];
    const sorted = sortOutages(seedOutages, 'customers');
    expect(sorted[0].customers).toBe(482);
    expect(seedOutages).toEqual(original);
  });
  it('exports properly quoted CSV', () => {
    const csv = exportCsv([{ ...seedOutages[0], area: 'North "Loop", MN' }]);
    expect(csv).toContain('"North ""Loop"", MN"');
  });
});
