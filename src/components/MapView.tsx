import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  driverLat?: number;
  driverLng?: number;
  customerLat?: number;
  customerLng?: number;
  singlePoint?: { lat: number; lng: number };
  className?: string;
  zoom?: number;
}

export default function MapView({
  driverLat,
  driverLng,
  customerLat,
  customerLng,
  singlePoint,
  className = '',
  zoom = 14,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center = singlePoint
      ? [singlePoint.lat, singlePoint.lng]
      : customerLat && customerLng
      ? [customerLat, customerLng]
      : [driverLat ?? 36.8065, driverLng ?? 10.1815];

    const map = L.map(containerRef.current, {
      center: center as [number, number],
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const driverIcon = L.divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;">🚗</div>`,
      className: 'custom-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const customerIcon = L.divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#22c55e;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;">📦</div>`,
      className: 'custom-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const singleIcon = L.divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:#22c55e;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:18px;">📍</div>`,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    if (singlePoint) {
      const marker = L.marker([singlePoint.lat, singlePoint.lng], { icon: singleIcon }).addTo(map);
      marker.bindPopup('Votre position').openPopup();
      map.setView([singlePoint.lat, singlePoint.lng], 15);
      return;
    }

    const markers: L.Marker[] = [];
    const points: [number, number][] = [];

    if (driverLat && driverLng) {
      const m = L.marker([driverLat, driverLng], { icon: driverIcon }).addTo(map);
      m.bindPopup('Vous (livreur)');
      markers.push(m);
      points.push([driverLat, driverLng]);
    }

    if (customerLat && customerLng) {
      const m = L.marker([customerLat, customerLng], { icon: customerIcon }).addTo(map);
      m.bindPopup('Client').openPopup();
      markers.push(m);
      points.push([customerLat, customerLng]);
    }

    if (points.length === 2) {
      L.polyline(points, {
        color: '#2563eb',
        weight: 3,
        dashArray: '8,8',
        opacity: 0.7,
      }).addTo(map);
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (points.length === 1) {
      map.setView(points[0], 15);
    }

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [driverLat, driverLng, customerLat, customerLng, singlePoint]);

  return <div ref={containerRef} className={`w-full h-full min-h-[200px] rounded-xl overflow-hidden ${className}`} />;
}
