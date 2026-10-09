import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
vi.mock('../components/OutageMap', () => ({ default: () => <div data-testid="mock-map">Map</div> }));
describe('Dashboard interactions', () => {
  it('filters outage reports by ID', async () => {
    render(<App />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Search outage reports' }), 'OUT-1042');
    expect(screen.getByRole('button', { name: /View outage OUT-1042/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /View outage OUT-1041/ })).not.toBeInTheDocument();
  });
  it('updates incident status and summary', async () => {
    render(<App />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Update status for OUT-1042/ }), 'Resolved');
    expect(screen.getByRole('combobox', { name: /Update status for OUT-1042/ })).toHaveValue('Resolved');
    expect(screen.getByText('INCIDENT OUT-1042')).toBeInTheDocument();
  });
});
