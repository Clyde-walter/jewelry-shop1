import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface OrderLocation {
  id: string;
  location_name: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  notes: string | null;
  created_at: string;
}

interface OrderLocationManagerProps {
  orderId: string;
  orderNumber: string;
}

export function OrderLocationManager({ orderId, orderNumber }: OrderLocationManagerProps) {
  const [locations, setLocations] = useState<OrderLocation[]>([]);
  const [newLocation, setNewLocation] = useState({
    location_name: '',
    latitude: '',
    longitude: '',
    status: 'in_transit',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, [orderId]);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('order_locations')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch shipping locations",
        variant: "destructive",
      });
    }
  };

  const addLocation = async () => {
    if (!newLocation.location_name.trim()) {
      toast({
        title: "Error",
        description: "Location name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('order_locations')
        .insert({
          order_id: orderId,
          location_name: newLocation.location_name,
          latitude: newLocation.latitude ? parseFloat(newLocation.latitude) : null,
          longitude: newLocation.longitude ? parseFloat(newLocation.longitude) : null,
          status: newLocation.status,
          notes: newLocation.notes || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shipping location added successfully",
      });

      setNewLocation({
        location_name: '',
        latitude: '',
        longitude: '',
        status: 'in_transit',
        notes: ''
      });

      fetchLocations();
    } catch (error) {
      console.error('Error adding location:', error);
      toast({
        title: "Error",
        description: "Failed to add shipping location",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (locationId: string) => {
    try {
      const { error } = await supabase
        .from('order_locations')
        .delete()
        .eq('id', locationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shipping location deleted successfully",
      });

      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: "Error",
        description: "Failed to delete shipping location",
        variant: "destructive",
      });
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewLocation(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast({
            title: "Success",
            description: "Current location coordinates added",
          });
        },
        (error) => {
          toast({
            title: "Error",
            description: "Unable to get current location",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Shipping Locations - Order {orderNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Location Form */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium">Add New Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location_name">Location Name</Label>
              <Input
                id="location_name"
                placeholder="e.g., Warehouse, In Transit, Delivered"
                value={newLocation.location_name}
                onChange={(e) => setNewLocation(prev => ({ ...prev, location_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newLocation.status} onValueChange={(value) => setNewLocation(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <div className="flex gap-2">
                <Input
                  id="latitude"
                  placeholder="e.g., 40.7128"
                  value={newLocation.latitude}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, latitude: e.target.value }))}
                />
                <Button type="button" variant="outline" onClick={getCurrentLocation}>
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                placeholder="e.g., -74.0060"
                value={newLocation.longitude}
                onChange={(e) => setNewLocation(prev => ({ ...prev, longitude: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional information about this location update"
              value={newLocation.notes}
              onChange={(e) => setNewLocation(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <Button onClick={addLocation} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>

        {/* Existing Locations */}
        <div className="space-y-4">
          <h3 className="font-medium">Current Shipping Progress</h3>
          {locations.length === 0 ? (
            <p className="text-muted-foreground">No shipping locations added yet.</p>
          ) : (
            <div className="space-y-3">
              {locations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{location.location_name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          location.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          location.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                          location.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          location.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {location.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      {(location.latitude && location.longitude) && (
                        <p className="text-sm text-muted-foreground">
                          Coordinates: {location.latitude}, {location.longitude}
                        </p>
                      )}
                      {location.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{location.notes}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Added on {new Date(location.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteLocation(location.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
