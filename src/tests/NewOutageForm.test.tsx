import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewOutageForm from '../components/NewOutageForm';

describe('New outage form', () => {
  it('rejects invalid input and announces the error', async () => {
    const onCreate = vi.fn();
    render(<NewOutageForm onClose={vi.fn()} onCreate={onCreate} />);
    await userEvent.click(screen.getByRole('button', { name: 'Create report' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid area');
    expect(onCreate).not.toHaveBeenCalled();
  });
  it('creates an outage with valid values', async () => {
    const onCreate = vi.fn();
    render(<NewOutageForm onClose={vi.fn()} onCreate={onCreate} />);
    await userEvent.type(screen.getByRole('textbox', { name: /Neighborhood/ }), 'Downtown');
    await userEvent.type(screen.getByRole('textbox', { name: /Street/ }), 'Main Street');
    await userEvent.clear(screen.getByRole('spinbutton', { name: /Customers affected/ }));
    await userEvent.type(screen.getByRole('spinbutton', { name: /Customers affected/ }), '45');
    await userEvent.click(screen.getByRole('button', { name: 'Create report' }));
    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ area: 'Downtown', customers: 45, status: 'Active' }));
  });
  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(<NewOutageForm onClose={onClose} onCreate={vi.fn()} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});
