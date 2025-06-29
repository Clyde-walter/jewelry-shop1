
import React, { useState, useEffect } from 'react';
import { Shield, Eye, Check, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WarrantyClaim {
  id: string;
  user_id: string;
  order_number: string;
  product_name: string;
  purchase_date: string;
  issue_description: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export function AdminWarranty() {
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from('warranty_claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error('Error fetching warranty claims:', error);
      toast({
        title: "Error loading claims",
        description: "Failed to load warranty claims.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || claim.priority === priorityFilter;
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
      case 'in-progress': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusUpdate = async (claimId: string, newStatus: WarrantyClaim['status']) => {
    try {
      const { error } = await supabase
        .from('warranty_claims')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', claimId);

      if (error) throw error;

      setClaims(prev => prev.map(claim => 
        claim.id === claimId ? { ...claim, status: newStatus } : claim
      ));

      toast({
        title: "Status updated",
        description: "Warranty claim status has been updated."
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update warranty claim status.",
        variant: "destructive"
      });
    }
  };

  const handleAddNotes = async () => {
    if (!selectedClaim || !adminNotes.trim()) return;

    try {
      const { error } = await supabase
        .from('warranty_claims')
        .update({ 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedClaim.id);

      if (error) throw error;

      setClaims(prev => prev.map(claim => 
        claim.id === selectedClaim.id 
          ? { ...claim, admin_notes: adminNotes }
          : claim
      ));

      toast({
        title: "Notes added",
        description: "Admin notes have been saved."
      });

      setAdminNotes('');
      setSelectedClaim(null);
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
    total: claims.length,
    pending: claims.filter(c => c.status === 'pending').length,
    inProgress: claims.filter(c => c.status === 'in-progress').length,
    approved: claims.filter(c => c.status === 'approved').length,
    rejected: claims.filter(c => c.status === 'rejected').length
  };

  if (loading) {
    return <div className="p-8">Loading warranty claims...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Warranty Claims Management</h1>
        <p className="text-gray-600">Manage and respond to warranty claims</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Shield className="w-8 h-8 text-gray-400" />
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
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Eye className="w-8 h-8 text-yellow-400" />
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
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search claims..."
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
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
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

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>Warranty Claims ({filteredClaims.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{claim.customer_name}</div>
                      <div className="text-sm text-gray-500">{claim.customer_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{claim.order_number}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{claim.product_name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getPriorityColor(claim.priority)}`}>
                      {claim.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(claim.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedClaim(claim);
                              setAdminNotes(claim.admin_notes || '');
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Warranty Claim Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Customer</label>
                                <p>{claim.customer_name}</p>
                                <p className="text-sm text-gray-500">{claim.customer_email}</p>
                                {claim.customer_phone && (
                                  <p className="text-sm text-gray-500">{claim.customer_phone}</p>
                                )}
                              </div>
                              <div>
                                <label className="text-sm font-medium">Order & Product</label>
                                <p>Order: {claim.order_number}</p>
                                <p>Product: {claim.product_name}</p>
                                <p>Purchase Date: {new Date(claim.purchase_date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Issue Description</label>
                              <p className="bg-gray-50 p-3 rounded">{claim.issue_description}</p>
                            </div>
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
                            <div className="flex gap-2">
                              <Select
                                value={claim.status}
                                onValueChange={(value) => handleStatusUpdate(claim.id, value as WarrantyClaim['status'])}
                              >
                                <SelectTrigger className="w-48">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Select
                        value={claim.status}
                        onValueChange={(value) => handleStatusUpdate(claim.id, value as WarrantyClaim['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
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
