import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import AccessibleDialog from './AccessibleDialog';
import type { Outage, Severity } from '../types';

type Props = { onClose: () => void; onCreate: (outage: Outage) => void };
const severityOptions: Severity[] = ['Critical','High','Moderate','Low'];

export default function NewOutageForm({ onClose, onCreate }: Props) {
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [customers, setCustomers] = useState('0');
  const [severity, setSeverity] = useState<Severity>('Moderate');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const customerCount = Number(customers);
    if (!area.trim() || !address.trim() || !Number.isSafeInteger(customerCount) || customerCount < 0 || customerCount > 1000000) {
      setError('Enter a valid area, street, and whole number of affected customers (0–1,000,000).');
      return;
    }
    setError('');
    const outage: Outage = {
      id: `OUT-${Date.now().toString().slice(-8)}`,
      area: area.trim(), address: address.trim(), customers: customerCount,
      severity, status: 'Active', cause: 'Unknown', crew: 'Unassigned',
      reportedAt: new Date().toISOString(), estimatedRestoration: 'Pending',
      x: 15 + Math.random()*70, y: 15 + Math.random()*70, notes: notes.trim() || 'New report submitted.'
    };
    onCreate(outage);
  }

  return (
    <AccessibleDialog titleId="new-outage-title" onClose={onClose}>
        <div className="modal-header"><div><div className="eyebrow">FIELD OPERATIONS</div><h2 id="new-outage-title">Create outage report</h2></div><button className="icon-button" onClick={onClose} aria-label="Close form"><X size={20}/></button></div>
        <form onSubmit={submit} noValidate>
          <div className="form-grid">
            <label>Neighborhood / area<input required maxLength={70} value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Cedar-Riverside"/></label>
            <label>Street or location<input required maxLength={100} value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Riverside Ave"/></label>
            <label>Customers affected<input required type="number" min="0" max="1000000" step="1" value={customers} onChange={e => setCustomers(e.target.value)}/></label>
            <label>Severity<select value={severity} onChange={e => setSeverity(e.target.value as Severity)}>{severityOptions.map(s => <option key={s}>{s}</option>)}</select></label>
            <label className="wide">Notes<textarea maxLength={500} rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="What was reported?"/></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <p className="helper-text">This portfolio demo stores reports only in your browser. Map markers use approximate, simulated positions.</p>
          <div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" type="submit">Create report</button></div>
        </form>
    </AccessibleDialog>
  );
}
