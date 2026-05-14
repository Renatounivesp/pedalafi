"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Neon Marker using DivIcon
const customIcon = typeof window !== 'undefined' ? L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,242,255,1)] animate-pulse"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
}) : null;

// Component to recenter map when location changes
function Recenter({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
}

interface MapProps {
  currentPosition: [number, number] | null;
  route: [number, number][];
  zoom?: number;
  interactive?: boolean;
  hideMarker?: boolean;
}

export default function Map({ 
  currentPosition, 
  route, 
  zoom = 16, 
  interactive = true,
  hideMarker = false
}: MapProps) {
  // Dark theme map tiles (CartoDB Dark Matter)
  const mapTileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const center = currentPosition || (route.length > 0 ? route[0] : [-23.55052, -46.633308]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={false}
      dragging={interactive}
      scrollWheelZoom={interactive}
      touchZoom={interactive}
    >
      <TileLayer url={mapTileUrl} />
      {!hideMarker && currentPosition && customIcon && (
        <Marker position={currentPosition} icon={customIcon} />
      )}
      {route.length > 1 && (
        <Polyline positions={route} color="#00f2ff" weight={interactive ? 6 : 4} opacity={0.8} />
      )}
      {interactive && currentPosition && <Recenter position={currentPosition} />}
    </MapContainer>
  );
}
