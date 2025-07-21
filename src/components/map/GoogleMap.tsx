import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';

interface GoogleMapProps {
  locations: Array<{
    id: string;
    location_name: string;
    latitude: number;
    longitude: number;
    status: string;
    notes?: string;
    created_at: string;
  }>;
  orderNumber?: string;
}

export function GoogleMap({ locations, orderNumber }: GoogleMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || locations.length === 0) return;

    // For now, we'll use a placeholder token. 
    // In production, this should come from Supabase Edge Function Secrets
    mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdCIsImEiOiJjbTBtZnNzZG4wN2RvMnFva3BrNTR6NjFjIn0.test'; // Placeholder

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 8,
      center: [locations[0].longitude, locations[0].latitude],
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create bounds to fit all locations
    const bounds = new mapboxgl.LngLatBounds();

    // Add markers for each location
    locations.forEach((location, index) => {
      // Extend bounds
      bounds.extend([location.longitude, location.latitude]);

      // Create marker color based on status
      const markerColor = getStatusColor(location.status);

      // Create marker
      const marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current!);

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-medium text-sm">${location.location_name}</h3>
            <p class="text-xs text-gray-600 capitalize">${location.status.replace('_', ' ')}</p>
            ${location.notes ? `<p class="text-xs mt-1">${location.notes}</p>` : ''}
            <p class="text-xs text-gray-500 mt-1">${new Date(location.created_at).toLocaleString()}</p>
          </div>
        `);

      marker.setPopup(popup);
    });

    // Fit map to show all markers
    if (locations.length > 1) {
      map.current.fitBounds(bounds, { padding: 50 });
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [locations]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'in_transit': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'processing': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  if (locations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            📍
          </div>
          <p>No shipping locations available for this order.</p>
          {orderNumber && (
            <p className="text-sm mt-2">Order: {orderNumber}</p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div ref={mapContainer} className="w-full h-96" />
        {orderNumber && (
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
            <p className="text-sm font-medium">Order: {orderNumber}</p>
            <p className="text-xs text-muted-foreground">{locations.length} location(s)</p>
          </div>
        )}
      </div>
    </Card>
  );
}

// Fallback component when Mapbox token is not available
export function MapboxTokenInput() {
  const [token, setToken] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  const saveToken = () => {
    if (token.trim()) {
      // In a real app, this would be saved to environment or user settings
      localStorage.setItem('mapbox_token', token);
      setSaved(true);
      window.location.reload(); // Refresh to use the new token
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-medium mb-4">Mapbox Setup Required</h3>
      <p className="text-sm text-muted-foreground mb-4">
        To display maps, please enter your Mapbox public token. You can get one from{' '}
        <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
          mapbox.com
        </a>
      </p>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="pk.eyJ1IjoieW91ciIsImEiOiJhY2Nlc3NfdG9rZW4ifQ..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <button
          onClick={saveToken}
          disabled={!token.trim() || saved}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
        >
          {saved ? 'Token Saved' : 'Save Token'}
        </button>
      </div>
    </Card>
  );
}