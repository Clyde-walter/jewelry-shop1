
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useSupport } from '@/contexts/SupportContext';
import { SupportStats } from '@/components/admin/support/SupportStats';
import { SupportFilters } from '@/components/admin/support/SupportFilters';
import { SupportRequestsTable } from '@/components/admin/support/SupportRequestsTable';
import { useSupportFilters } from '@/hooks/useSupportFilters';
import { useSupportStats } from '@/hooks/useSupportStats';

export function AdminSupport() {
  const { supportRequests, updateSupportRequest, deleteSupportRequest, loading } = useSupport();
  
  const {
    searchTerm,
    statusFilter,
    priorityFilter,
    filteredRequests,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter
  } = useSupportFilters(supportRequests);

  const stats = useSupportStats(supportRequests);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-ecommerce-600" />
            <p className="text-gray-600">Loading support requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Customer Support</h1>
        <p className="text-gray-600">Manage customer support requests and provide assistance.</p>
      </div>

      <SupportStats {...stats} />

      <SupportFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <SupportRequestsTable
        supportRequests={filteredRequests}
        onUpdateRequest={updateSupportRequest}
        onDeleteRequest={deleteSupportRequest}
      />
    </div>
  );
}
