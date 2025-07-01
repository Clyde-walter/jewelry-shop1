
import { useState, useMemo } from 'react';
import { SupportRequest } from '@/types/support';

export function useSupportFilters(supportRequests: SupportRequest[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredRequests = useMemo(() => {
    return supportRequests.filter(request => {
      const matchesSearch = 
        request.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [supportRequests, searchTerm, statusFilter, priorityFilter]);

  return {
    searchTerm,
    statusFilter,
    priorityFilter,
    filteredRequests,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter
  };
}
