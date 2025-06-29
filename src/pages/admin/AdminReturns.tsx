
import React, { useState, useEffect } from 'react';
import { RotateCcw, Eye, Check, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReturnRequest {
  id: string;
  user_id: string;
  order_number: string;
  customer_email: string;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  priority: 'low' | 'medium' | 'high';
  admin_notes: string;
  return_label_sent: boolean;
  created_at: string;
  updated_at: string;
}

export function AdminReturns() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('return_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching return requests:', error);
      toast({
        title: "Error loading requests",
        description: "Failed to load return requests.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'processed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: ReturnRequest['status']) => {
    try {
      const { error } = await supabase
        .from('return_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev => prev.map(request => 
        request.id === requestId ? { ...request, status: newStatus } : request
      ));

      toast({
        title: "Status updated",
        description: "Return request status has been updated."
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update return request status.",
        variant: "destructive"
      });
    }
  };

  const handleToggleReturnLabel = async (requestId: string, sent: boolean) => {
    try {
      const { error } = await supabase
        .from('return_requests')
        .update({ 
          return_label_sent: sent,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev => prev.map(request => 
        request.id === requestId ? { ...request, return_label_sent: sent } : request
      ));

      toast({
        title: sent ? "Return label marked as sent" : "Return label marked as not sent",
        description: "Return label status has been updated."
      });
    } catch (error) {
      console.error('Error updating return label status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update return label status.",
        variant: "destructive"
      });
    }
  };

  const handleAddNotes = async () => {
    if (!selectedRequest || !adminNotes.trim()) return;

    try {
      const { error } = await supabase
        .from('return_requests')
        .update({ 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      setRequests(prev => prev.map(request => 
        request.id === selectedRequest.id 
          ? { ...request, admin_notes: adminNotes }
          : request
      ));

      toast({
        title: "Notes added",
        description: "Admin notes have been saved."
      });

      setAdminNotes('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error adding notes:', error);
      toast({
        title: "Error saving notes",
        description: "Failed to save admin notes.",
        variant: "destructive"
      });
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    processed: requests.filter(r => r.status === 'processed').length
  };

  if (loading) {
    return <div className="p-8">Loading return requests...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Return Requests Management</h1>
        <p className="text-gray-600">Manage and process return requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Returns</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <RotateCcw className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <Check className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <Package className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.processed}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search returns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Returns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Return Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Label Sent</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.order_number}</TableCell>
                  <TableCell>
                    <div className="text-sm">{request.customer_email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{request.reason}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getStatusColor(request.status)}`}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={request.return_label_sent}
                        onCheckedChange={(checked) => 
                          handleToggleReturnLabel(request.id, checked as boolean)
                        }
                      />
                      <span className="text-sm">
                        {request.return_label_sent ? 'Sent' : 'Not sent'}
                      </span>
                    </div>
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
                              setAdminNotes(request.admin_notes || '');
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Return Request Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Order Number</label>
                                <p>{request.order_number}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Customer Email</label>
                                <p>{request.customer_email}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Return Reason</label>
                              <p>{request.reason}</p>
                            </div>
                            {request.description && (
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <p className="bg-gray-50 p-3 rounded">{request.description}</p>
                              </div>
                            )}
                            <div>
                              <label className="text-sm font-medium">Admin Notes</label>
                              <Textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add admin notes..."
                                rows={3}
                              />
                              <Button onClick={handleAddNotes} className="mt-2">
                                Save Notes
                              </Button>
                            </div>
                            <div className="flex gap-2 items-center">
                              <Select
                                value={request.status}
                                onValueChange={(value) => handleStatusUpdate(request.id, value as ReturnRequest['status'])}
                              >
                                <SelectTrigger className="w-48">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                  <SelectItem value="processed">Processed</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={request.return_label_sent}
                                  onCheckedChange={(checked) => 
                                    handleToggleReturnLabel(request.id, checked as boolean)
                                  }
                                />
                                <span className="text-sm">Return label sent</span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Select
                        value={request.status}
                        onValueChange={(value) => handleStatusUpdate(request.id, value as ReturnRequest['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="processed">Processed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
