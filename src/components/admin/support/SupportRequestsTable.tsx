
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupportRequest } from '@/types/support';
import { toast } from '@/hooks/use-toast';

interface SupportRequestsTableProps {
  supportRequests: SupportRequest[];
  onUpdateRequest: (id: string, updates: Partial<SupportRequest>) => Promise<void>;
  onDeleteRequest: (id: string) => Promise<void>;
}

export function SupportRequestsTable({ 
  supportRequests, 
  onUpdateRequest, 
  onDeleteRequest 
}: SupportRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [adminResponse, setAdminResponse] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    await onUpdateRequest(requestId, { status: newStatus as SupportRequest['status'] });
  };

  const handleRespondToRequest = async () => {
    if (!selectedRequest || !adminResponse.trim()) {
      toast({
        title: "Please enter a response",
        variant: "destructive"
      });
      return;
    }

    await onUpdateRequest(selectedRequest.id, {
      admin_response: adminResponse,
      status: 'resolved'
    });

    setSelectedRequest(null);
    setAdminResponse('');
    toast({
      title: "Response sent!",
      description: "The customer has been notified."
    });
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (window.confirm('Are you sure you want to delete this support request?')) {
      await onDeleteRequest(requestId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Requests ({supportRequests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supportRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{request.customer_name}</p>
                    <p className="text-sm text-gray-500">{request.customer_email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium truncate">{request.subject}</p>
                    <p className="text-sm text-gray-500 truncate">{request.message}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setAdminResponse(request.admin_response || '');
                          }}
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Support Request Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Customer</Label>
                              <p className="font-medium">{request.customer_name}</p>
                              <p className="text-sm text-gray-500">{request.customer_email}</p>
                            </div>
                            <div>
                              <Label>Priority</Label>
                              <Badge className={getPriorityColor(request.priority)}>
                                {request.priority}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label>Subject</Label>
                            <p className="font-medium">{request.subject}</p>
                          </div>
                          <div>
                            <Label>Message</Label>
                            <p className="text-sm bg-gray-50 p-3 rounded">{request.message}</p>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <Select
                              value={request.status}
                              onValueChange={(value) => handleStatusChange(request.id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Admin Response</Label>
                            <Textarea
                              value={adminResponse}
                              onChange={(e) => setAdminResponse(e.target.value)}
                              placeholder="Type your response to the customer..."
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleRespondToRequest} disabled={!adminResponse.trim()}>
                              Send Response
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteRequest(request.id)}
                            >
                              Delete Request
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
