import { useEffect, useRef, useState } from 'react';
import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Outage } from '../types';
import { outageCoordinates } from '../lib/mapCoordinates';

type Props = {
  outages: Outage[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const CENTER: [number, number] = [-93.265, 44.977];

function markerColor(outage: Outage) {
  if (outage.status === 'Resolved') return '#64748b';
  return {
    Critical: '#e34e53',
    High: '#ef8b3b',
    Moderate: '#e8b647',
    Low: '#338ba6',
  }[outage.severity];
}

export default function OutageMap({ outages, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Keep the latest callback without re-creating the map on every selection.
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: CENTER,
      zoom: 10.8,
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    const onLoad = () => setMapReady(true);
    const onError = (event: { error?: Error }) => {
      // Style/tile requests need internet access. Show a useful fallback message.
      if (event.error) {
        console.warn('MapLibre map resource failed:', event.error);
        setMapError(true);
      }
    };
    map.on('load', onLoad);
    map.on('error', onError);

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    for (const outage of outages) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `outage-map-marker${outage.id === selectedId ? ' is-selected' : ''}`;
      button.style.setProperty('--marker-color', markerColor(outage));
      button.setAttribute('aria-label', `${outage.id}: ${outage.area}, ${outage.status}, ${outage.customers} customers affected`);
      button.title = `${outage.id} · ${outage.area} · ${outage.status}`;
      button.addEventListener('click', () => onSelectRef.current(outage.id));

      const marker = new maplibregl.Marker({ element: button, anchor: 'center' })
        .setLngLat(outageCoordinates(outage))
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [outages, selectedId, mapReady]);

  useEffect(() => {
    const selected = outages.find(outage => outage.id === selectedId);
    if (!selected || !mapRef.current || !mapReady) return;
    mapRef.current.easeTo({
      center: outageCoordinates(selected),
      duration: 550,
      essential: true,
    });
  }, [selectedId, outages, mapReady]);

  return (
    <div className="map-shell maplibre-shell">
      <div className="maplibre-container" ref={containerRef} aria-label="Interactive outage map showing simulated Minneapolis-area outage locations" />
      {!mapReady && !mapError && <div className="map-loading" role="status">Loading map…</div>}
      {mapError && !mapReady && (
        <div className="map-error" role="alert">
          <strong>Map tiles unavailable</strong>
          <span>Check your internet connection. Outage reports remain available in the table.</span>
        </div>
      )}
      <div className="map-scale">INTERACTIVE MAP <span>•</span> SIMULATED LOCATIONS</div>
      <div className="map-legend">
        <span><i className="legend-dot critical"/> Critical</span>
        <span><i className="legend-dot high"/> High</span>
        <span><i className="legend-dot moderate"/> Moderate</span>
        <span><i className="legend-dot resolved"/> Resolved</span>
      </div>
    </div>
  );
}
