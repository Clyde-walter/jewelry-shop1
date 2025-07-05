import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Search, Filter, Eye, Check, Clock } from 'lucide-react';
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

interface SupportRequest {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  admin_response: string;
  created_at: string;
  updated_at: string;
}

export function AdminSupport() {
  const [messages, setMessages] = useState<SupportRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<SupportRequest | null>(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('support_requests_admin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_requests'
        },
        (payload) => {
          console.log('Support request change detected:', payload);
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('support_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages((data || []) as SupportRequest[]);
    } catch (error) {
      console.error('Error fetching support requests:', error);
      toast({
        title: "Error loading messages",
        description: "Failed to load support requests.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
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
      case 'open': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusUpdate = async (messageId: string, newStatus: SupportRequest['status']) => {
    try {
      const { error } = await supabase
        .from('support_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      ));

      const message = messages.find(m => m.id === messageId);
      toast({
        title: "Status updated!",
        description: `Message from ${message?.customer_name || messageId} status changed to ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update support request status.",
        variant: "destructive"
      });
    }
  };

  const handleSendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;

    try {
      const { error } = await supabase
        .from('support_requests')
        .update({ 
          admin_response: responseText,
          status: 'resolved',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedMessage.id);

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === selectedMessage.id 
          ? { ...msg, admin_response: responseText, status: 'resolved' }
          : msg
      ));

      toast({
        title: "Response sent!",
        description: "Your response has been saved and the customer will be notified."
      });

      setResponseText('');
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Error sending response",
        description: "Failed to save response.",
        variant: "destructive"
      });
    }
  };

  const generateAIResponse = (message: SupportRequest) => {
    const aiResponses: { [key: string]: string } = {
      'Live Chat Support': 'Thank you for reaching out through our live chat. I understand you need assistance. Could you please provide more details about the specific issue you\'re experiencing so I can better help you?',
      'Order delivery issue': 'Thank you for contacting us. I understand your concern about the delayed delivery. Let me check the tracking information for your order and provide you with an update. We may also offer expedited shipping for a replacement if needed.',
      'Product return request': 'I apologize for the inconvenience with your purchase. Before processing a return, let me help you with some troubleshooting steps that might resolve the issue. If the problem persists, I will be happy to process your return request.',
      'Product inquiry': 'Thank you for your interest in our products. I\'d be happy to provide you with detailed information about our jewelry pieces. Could you please let me know which specific product you\'re interested in?',
      'Payment issue': 'I apologize for any payment-related difficulties you\'ve experienced. Let me review your payment details and help resolve this issue promptly. Your security and satisfaction are our top priorities.',
      'Technical support': 'Thank you for reporting this technical issue. I\'ll help you troubleshoot this problem step by step. Could you please provide more details about what you were trying to do when the issue occurred?',
      'General inquiry': 'Thank you for reaching out to us. I have received your message and will review your inquiry carefully. I will get back to you within 24 hours with a detailed response.'
    };

    const response = aiResponses[message.subject] || aiResponses['General inquiry'];
    setResponseText(response);
  };

  const stats = {
    total: messages.length,
    open: messages.filter(m => m.status === 'open').length,
    inProgress: messages.filter(m => m.status === 'in-progress').length,
    resolved: messages.filter(m => m.status === 'resolved').length
  };

  if (loading) {
    return <div className="p-8">Loading support requests...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Customer Support</h1>
        <p className="text-gray-600">Manage customer inquiries with AI-powered assistance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
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
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <Check className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Customer Messages ({filteredMessages.length})
          </CardTitle>
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
              {filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{message.customer_name}</div>
                      <div className="text-sm text-gray-500">{message.customer_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium">{message.subject}</div>
                      <div className="text-sm text-gray-500 truncate">{message.message}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getPriorityColor(message.priority)}`}>
                      {message.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getStatusColor(message.status)}`}>
                      {message.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMessage(message);
                              setResponseText(message.admin_response || '');
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Customer Message Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Customer</label>
                                <p>{message.customer_name}</p>
                                <p className="text-sm text-gray-500">{message.customer_email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Date</label>
                                <p>{new Date(message.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Subject</label>
                              <p>{message.subject}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Message</label>
                              <p className="bg-gray-50 p-3 rounded">{message.message}</p>
                            </div>
                            {message.admin_response && (
                              <div>
                                <label className="text-sm font-medium">Previous Response</label>
                                <p className="bg-green-50 p-3 rounded border border-green-200">{message.admin_response}</p>
                              </div>
                            )}
                            <div>
                              <label className="text-sm font-medium">Your Response</label>
                              <Textarea
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Type your response..."
                                rows={4}
                              />
                              <div className="flex gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => generateAIResponse(message)}
                                >
                                  <Bot className="w-4 h-4 mr-2" />
                                  Generate AI Response
                                </Button>
                                <Button
                                  onClick={handleSendResponse}
                                  disabled={!responseText.trim()}
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Send Response
                                </Button>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Select
                                value={message.status}
                                onValueChange={(value) => handleStatusUpdate(message.id, value as SupportRequest['status'])}
                              >
                                <SelectTrigger className="w-48">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Select
                        value={message.status}
                        onValueChange={(value) => handleStatusUpdate(message.id, value as SupportRequest['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
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
