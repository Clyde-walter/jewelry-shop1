
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface OrderMapProps {
  coordinates?: { lat: number; lng: number };
  location?: string;
  orderId?: string;
}

export function OrderMap({ coordinates, location, orderId }: OrderMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!coordinates || !mapRef.current) return;

    // Simulate a satellite map view
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';
    
    // Create a satellite-style map representation
    const mapDiv = document.createElement('div');
    mapDiv.className = 'relative w-full h-full bg-slate-800 rounded-lg overflow-hidden';
    
    // Add satellite-style background with earth tones
    mapDiv.style.backgroundImage = `
      radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 60% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
      linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)
    `;
    
    // Add terrain-like patterns
    const terrainOverlay = document.createElement('div');
    terrainOverlay.className = 'absolute inset-0 opacity-40';
    terrainOverlay.style.backgroundImage = `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.05) 2px,
        rgba(255, 255, 255, 0.05) 4px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 3px,
        rgba(0, 0, 0, 0.1) 3px,
        rgba(0, 0, 0, 0.1) 6px
      )
    `;
    mapDiv.appendChild(terrainOverlay);
    
    // Position marker based on coordinates with satellite-style pin
    const markerX = (coordinates.lng + 180) / 360 * 100;
    const markerY = (90 - coordinates.lat) / 180 * 100;
    
    const marker = document.createElement('div');
    marker.className = 'absolute transform -translate-x-1/2 -translate-y-1/2 z-20';
    marker.style.left = `${Math.max(5, Math.min(95, markerX))}%`;
    marker.style.top = `${Math.max(5, Math.min(95, markerY))}%`;
    
    // Enhanced marker with pulsing animation
    marker.innerHTML = `
      <div class="relative">
        <div class="absolute w-8 h-8 bg-red-400 rounded-full animate-ping opacity-30"></div>
        <div class="relative w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
          <div class="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div class="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
          <div class="font-semibold">${location || 'Current Location'}</div>
          <div class="text-xs text-gray-300">${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}</div>
          <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black bg-opacity-80 rotate-45"></div>
        </div>
      </div>
    `;
    
    // Add some random "city lights" for satellite effect
    for (let i = 0; i < 15; i++) {
      const light = document.createElement('div');
      light.className = 'absolute w-1 h-1 bg-yellow-300 rounded-full opacity-60';
      light.style.left = `${Math.random() * 100}%`;
      light.style.top = `${Math.random() * 100}%`;
      light.style.boxShadow = '0 0 4px rgba(253, 224, 71, 0.8)';
      mapDiv.appendChild(light);
    }
    
    mapDiv.appendChild(marker);
    mapContainer.appendChild(mapDiv);

    // Add satellite view label
    const satelliteLabel = document.createElement('div');
    satelliteLabel.className = 'absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium';
    satelliteLabel.textContent = 'Satellite View';
    mapDiv.appendChild(satelliteLabel);
    
  }, [coordinates, location]);

  if (!coordinates) {
    return (
      <div className="bg-slate-800 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-white">No Location Data</h3>
          <p className="text-gray-400">
            Location tracking will be available once your order is shipped and tracking updates are provided.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg h-96 relative overflow-hidden shadow-2xl">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 rounded-lg shadow-xl p-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-400" />
          <div>
            <p className="text-sm font-medium text-white">{location}</p>
            <p className="text-xs text-gray-300">
              {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
