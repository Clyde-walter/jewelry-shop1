
import { useMemo } from 'react';
import { SupportRequest } from '@/types/support';

export function useSupportStats(supportRequests: SupportRequest[]) {
  return useMemo(() => ({
    totalRequests: supportRequests.length,
    openRequests: supportRequests.filter(r => r.status === 'open').length,
    inProgressRequests: supportRequests.filter(r => r.status === 'in_progress').length,
    resolvedRequests: supportRequests.filter(r => r.status === 'resolved').length,
  }), [supportRequests]);
}
