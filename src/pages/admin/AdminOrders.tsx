
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { toast } from '@/hooks/use-toast';
import { OrderStats } from '@/components/admin/OrderStats';
import { OrderFilters } from '@/components/admin/OrderFilters';
import { OrdersTable } from '@/components/admin/OrdersTable';

export function AdminOrders() {
  const { orders, updateOrderStatus, loading } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus as any);
    const order = orders.find(o => o.id === orderId);
    toast({
      title: "Order status updated!",
      description: `Order ${order?.orderNumber || orderId} status changed to ${newStatus}`
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-ecommerce-600" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
        <p className="text-gray-600">Track and manage customer orders and shipping status</p>
      </div>

      <OrderStats orders={orders} />
      
      <OrderFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <OrdersTable 
        orders={filteredOrders}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
