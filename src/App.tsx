import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownToLine, Bell, Bolt, CheckCircle2, ChevronDown, CircleHelp, Clock3, LayoutDashboard, MapPinned, Menu, Plus, RotateCcw, Search, Settings2, ShieldCheck, Users, X, Zap } from 'lucide-react';
import OutageMap from './components/OutageMap';
import NewOutageForm from './components/NewOutageForm';
import AccessibleDialog from './components/AccessibleDialog';
import { exportCsv, filterOutages, sortOutages, summarizeOutages, statuses } from './lib/outageUtils';
import { loadOutages, resetOutages, saveOutages } from './lib/storage';
import type { Outage, Status } from './types';

const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);
function formatTime(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(date));
}
function downloadCsv(outages: Outage[]) {
  const blob = new Blob([exportCsv(outages)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'gridview-outages.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [outages, setOutages] = useState<Outage[]>(loadOutages);
  const [selectedId, setSelectedId] = useState<string | null>('OUT-1042');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [severity, setSeverity] = useState('All severities');
  const [sort, setSort] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => saveOutages(outages), [outages]);
  const summary = useMemo(() => summarizeOutages(outages), [outages]);
  const filtered = useMemo(() => sortOutages(filterOutages(outages, search, status, severity), sort), [outages, search, status, severity, sort]);
  const selected = outages.find(o => o.id === selectedId) ?? null;

  function changeStatus(id: string, next: Status) {
    setOutages(current => current.map(o => o.id === id ? { ...o, status: next, customers: next === 'Resolved' ? 0 : o.customers, estimatedRestoration: next === 'Resolved' ? 'Completed' : o.estimatedRestoration } : o));
  }
  function createOutage(outage: Outage) {
    setOutages(current => [outage, ...current]);
    setSelectedId(outage.id); setSearch(''); setStatus('All statuses'); setSeverity('All severities'); setShowForm(false);
  }
  function resetDemo() {
    if (window.confirm('Reset all changes and restore the original demo reports?')) {
      setOutages(resetOutages()); setSelectedId('OUT-1042'); setSearch(''); setStatus('All statuses'); setSeverity('All severities');
    }
  }
  return <div className="app-shell">
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Zap size={21} fill="currentColor"/></div><span>gridview<span className="brand-dot">.</span></span><button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={20}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <div className="workspace-switch"><div className="workspace-avatar">N</div><div><strong>Northstar Utilities</strong><small>Operations workspace</small></div><ChevronDown size={16}/></div>
      <div className="nav-label">OPERATIONS</div>
      <nav aria-label="Main navigation">
        <button className="nav-item active" onClick={() => setSidebarOpen(false)}><LayoutDashboard size={18}/> Overview</button>
        <button className="nav-item" onClick={() => { document.getElementById('outage-table')?.scrollIntoView({behavior:'smooth'}); setSidebarOpen(false); }}><Activity size={18}/> Outage reports <span className="nav-count">{summary.activeCount}</span></button>
        <button className="nav-item" onClick={() => { document.getElementById('outage-map')?.scrollIntoView({behavior:'smooth'}); setSidebarOpen(false); }}><MapPinned size={18}/> Service map</button>
      </nav>
      <div className="nav-label tools-label">WORKSPACE</div>
      <nav aria-label="Workspace tools"><button className="nav-item" onClick={() => setShowInfo(true)}><CircleHelp size={18}/> About this demo</button><button className="nav-item" onClick={resetDemo}><RotateCcw size={18}/> Reset demo data</button></nav>
      <div className="sidebar-bottom"><div className="system-status"><span className="status-led"/> Demo environment <span>Online</span></div><div className="profile"><div className="profile-avatar">GV</div><div><strong>Portfolio Preview</strong><small>Local browser session</small></div><Settings2 size={17}/></div></div>
    </aside>
    {sidebarOpen && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}/>}
    <div className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={22}/></button><span>Operations</span><span className="crumb">/</span><strong>Overview</strong></div><div className="topbar-right"><span className="environment"><span className="status-led"/> DEMO MODE</span><button className="icon-button" aria-label="About this demo" onClick={() => setShowInfo(true)}><Bell size={19}/></button><div className="top-avatar">GV</div></div></header>
      <main className="content" id="main-content" tabIndex={-1}>
        <div className="page-heading"><div><div className="eyebrow">THURSDAY, OCTOBER 8, 2026 · SAMPLE DATA</div><h1>Operations overview</h1><p>Monitor service interruptions, track crews, and manage restoration progress.</p></div><button className="button primary new-report" onClick={() => setShowForm(true)}><Plus size={18}/> New outage report</button></div>
        <div className="notice"><ShieldCheck size={18}/><span><strong>Portfolio demonstration.</strong> All outage records and marker positions are simulated; map tiles show real geography. Changes are saved only in your browser.</span><button onClick={() => setShowInfo(true)}>Learn more</button></div>
        <section className="metrics" aria-label="Outage summary">
          <div className="metric-card"><div className="metric-top"><span>Active outages</span><div className="metric-icon coral"><Bolt size={19}/></div></div><div className="metric-value">{formatNumber(summary.activeCount)}</div><div className="metric-footer"><span className="metric-tag coral-text">Live demo</span> Currently unresolved</div></div>
          <div className="metric-card"><div className="metric-top"><span>Customers affected</span><div className="metric-icon amber"><Users size={19}/></div></div><div className="metric-value">{formatNumber(summary.customersAffected)}</div><div className="metric-footer"><span className="metric-tag amber-text">Estimated</span> Across active outages</div></div>
          <div className="metric-card"><div className="metric-top"><span>Crews dispatched</span><div className="metric-icon blue"><Activity size={19}/></div></div><div className="metric-value">{summary.crewsDispatched}</div><div className="metric-footer"><span className="metric-tag blue-text">In progress</span> Field response underway</div></div>
          <div className="metric-card"><div className="metric-top"><span>Resolved reports</span><div className="metric-icon green"><CheckCircle2 size={19}/></div></div><div className="metric-value">{summary.resolvedCount}</div><div className="metric-footer"><span className="metric-tag green-text">Completed</span> In this demo dataset</div></div>
        </section>
        <div className="dashboard-grid">
          <section className="panel map-panel" id="outage-map"><div className="panel-heading"><div><h2>Service area map</h2><p>Select a marker to view an outage report</p></div><span className="panel-chip"><span className="status-led"/> {summary.activeCount} open</span></div><OutageMap outages={outages} selectedId={selectedId} onSelect={setSelectedId}/></section>
          <section className="panel details-panel" aria-label="Selected outage details"><div className="panel-heading"><div><h2>Outage details</h2><p>Selected incident information</p></div><span className="detail-dots">•••</span></div>
            {selected ? <div className="detail-body"><div className="detail-heading"><div><div className="eyebrow">INCIDENT {selected.id}</div><h3>{selected.area}</h3><span className="address">{selected.address}</span></div><span className={`severity-pill ${selected.severity.toLowerCase()}`}>{selected.severity}</span></div><div className="detail-stats"><div><span>Customers affected</span><strong>{formatNumber(selected.customers)}</strong></div><div><span>Est. restoration</span><strong>{selected.estimatedRestoration}</strong></div></div><div className="detail-row"><span>Current status</span><span className={`status-pill ${selected.status.toLowerCase().replaceAll(' ','-')}`}>{selected.status}</span></div><div className="detail-row"><span>Reported</span><strong>{formatTime(selected.reportedAt)}</strong></div><div className="detail-row"><span>Probable cause</span><strong>{selected.cause}</strong></div><div className="detail-row"><span>Assigned crew</span><strong>{selected.crew}</strong></div><div className="detail-note"><strong>Field notes</strong><p>{selected.notes}</p></div><label className="status-change">Update status<select aria-label={`Update status for ${selected.id}`} value={selected.status} onChange={e => changeStatus(selected.id, e.target.value as Status)}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label></div> : <div className="empty-state">Select a marker or table row to view details.</div>}
          </section>
        </div>
        <section className="panel table-panel" id="outage-table"><div className="table-heading"><div><h2>Outage reports</h2><p>Search, filter, and review reported interruptions</p></div><button className="button secondary export-button" onClick={() => downloadCsv(filtered)}><ArrowDownToLine size={16}/> Export CSV</button></div><div className="table-toolbar"><label className="search-field"><Search size={18}/><input aria-label="Search outage reports" placeholder="Search by ID, area, location, or crew..." value={search} onChange={e => setSearch(e.target.value)}/></label><select aria-label="Filter by status" value={status} onChange={e => setStatus(e.target.value)}><option>All statuses</option>{statuses.map(s => <option key={s}>{s}</option>)}</select><select aria-label="Filter by severity" value={severity} onChange={e => setSeverity(e.target.value)}><option>All severities</option>{['Critical','High','Moderate','Low'].map(s => <option key={s}>{s}</option>)}</select><select aria-label="Sort outage reports" value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest first</option><option value="severity">Highest severity</option><option value="customers">Most customers</option><option value="area">Area A–Z</option></select></div>
          <div className="table-scroll" role="region" aria-label="Outage reports table" tabIndex={0}><table><thead><tr><th scope="col">OUTAGE ID</th><th scope="col">LOCATION</th><th scope="col">SEVERITY</th><th scope="col">STATUS</th><th scope="col">CUSTOMERS</th><th scope="col">REPORTED</th></tr></thead><tbody>{filtered.map(o => <tr key={o.id} className={o.id === selectedId ? 'selected-row' : ''} ><td><button className="row-select-button" aria-pressed={o.id === selectedId} onClick={() => setSelectedId(o.id)} aria-label={`View outage ${o.id} in ${o.area}`}>{o.id}</button></td><td><strong>{o.area}</strong><small>{o.address}</small></td><td><span className={`severity-pill ${o.severity.toLowerCase()}`}><span className="tiny-dot"/>{o.severity}</span></td><td><span className={`status-pill ${o.status.toLowerCase().replaceAll(' ','-')}`}>{o.status}</span></td><td className="numeric">{formatNumber(o.customers)}</td><td className="date-cell"><Clock3 size={13}/>{formatTime(o.reportedAt)}</td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">No outage reports match your filters. Try another search.</div>}</div><div className="table-footer">Showing <strong>{filtered.length}</strong> of <strong>{outages.length}</strong> reports <span>Demo data · Not connected to a live utility system</span></div></section>
        <footer className="page-footer"><span>© 2026 GridView · Independent portfolio project</span><span>Built with React, TypeScript & MapLibre</span></footer>
      </main>
    </div>
    {showForm && <NewOutageForm onClose={() => setShowForm(false)} onCreate={createOutage}/>}
    {showInfo && <AccessibleDialog titleId="info-title" onClose={() => setShowInfo(false)} className="info-modal"><div className="modal-header"><div><div className="eyebrow">ABOUT GRIDVIEW</div><h2 id="info-title">A fictional utility operations dashboard</h2></div><button className="icon-button" aria-label="Close information" onClick={() => setShowInfo(false)}><X size={20}/></button></div><p>GridView is an original frontend portfolio demonstration. It uses fictional utility records and simulated marker locations on real geographic basemap tiles, not live outage feeds, real customer addresses, or proprietary employer code.</p><p>Search, filters, map selection, status changes, CSV export, and new reports work locally in your browser. Your changes are stored in localStorage until you reset them.</p><button className="button primary" onClick={() => setShowInfo(false)}>Got it</button></AccessibleDialog>}
  </div>;
}
