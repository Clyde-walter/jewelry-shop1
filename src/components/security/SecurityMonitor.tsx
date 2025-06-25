
import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'admin_access' | 'suspicious_activity';
  timestamp: number;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function SecurityMonitor() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!user) return;

    setIsMonitoring(true);

    // Monitor for suspicious patterns
    const monitorActivity = () => {
      // Check for rapid page changes (potential bot behavior)
      let pageChanges = 0;
      const startTime = Date.now();

      const trackPageChange = () => {
        pageChanges++;
        if (pageChanges > 20 && Date.now() - startTime < 60000) {
          logSecurityEvent({
            type: 'suspicious_activity',
            details: 'Rapid page navigation detected',
            severity: 'medium'
          });
        }
      };

      window.addEventListener('popstate', trackPageChange);
      
      // Monitor for unusual network patterns
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        
        // Log failed API calls that might indicate probing
        if (!response.ok && response.status >= 400) {
          logSecurityEvent({
            type: 'suspicious_activity',
            details: `Failed API request: ${response.status} ${args[0]}`,
            severity: 'low'
          });
        }
        
        return response;
      };

      return () => {
        window.removeEventListener('popstate', trackPageChange);
        window.fetch = originalFetch;
      };
    };

    const cleanup = monitorActivity();

    return () => {
      setIsMonitoring(false);
      cleanup();
    };
  }, [user]);

  const logSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    const securityEvent: SecurityEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      ...event
    };

    setEvents(prev => [securityEvent, ...prev.slice(0, 49)]); // Keep last 50 events

    // Log to console for debugging
    console.log(`[SECURITY] ${event.type.toUpperCase()}: ${event.details}`);

    // In production, you would send this to your security monitoring service
  };

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityIcon = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (!user) return null;

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Monitor
          {isMonitoring && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No security events detected</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                <span className={getSeverityColor(event.severity)}>
                  {getSeverityIcon(event.severity)}
                </span>
                <div className="flex-1">
                  <p className="font-medium">{event.type.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-gray-600">{event.details}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
