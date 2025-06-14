
import React, { useState } from 'react';
import { Send, Users, Mail, FileText, Plus, Eye, Edit, Trash2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEmails } from '@/contexts/EmailContext';

const EMAIL_TYPES = [
  { value: 'newsletter', label: 'Newsletter', color: 'bg-blue-100 text-blue-800' },
  { value: 'order_status', label: 'Order Status', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'promotion', label: 'Promotion', color: 'bg-green-100 text-green-800' },
  { value: 'welcome', label: 'Welcome', color: 'bg-purple-100 text-purple-800' },
  { value: 'support', label: 'Support', color: 'bg-red-100 text-red-800' },
  { value: 'auth_confirmation', label: 'Email Confirmation', color: 'bg-gray-100 text-gray-800' },
  { value: 'auth_password_reset', label: 'Password Reset', color: 'bg-orange-100 text-orange-800' },
  { value: 'auth_magic_link', label: 'Magic Link', color: 'bg-indigo-100 text-indigo-800' }
];

export function AdminEmails() {
  const { templates, emailHistory, loading, sendEmail, createTemplate, updateTemplate, deleteTemplate } = useEmails();
  
  const [emailData, setEmailData] = useState({
    recipient: 'all',
    customRecipient: '',
    subject: '',
    content: '',
    template: '',
    variables: {}
  });
  
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'newsletter' as any,
    subject: '',
    content: '',
    variables: [] as string[],
    is_active: true,
    is_default: false
  });
  
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEmailData({
        ...emailData,
        subject: template.subject,
        content: template.content,
        template: templateId
      });
    }
  };

  const handleSendEmail = async () => {
    if (!emailData.subject || !emailData.content) {
      return;
    }

    setIsLoading(true);
    
    try {
      await sendEmail({
        templateId: emailData.template || undefined,
        recipientType: emailData.recipient as any,
        customRecipient: emailData.customRecipient || undefined,
        subject: emailData.subject,
        content: emailData.content,
        variables: emailData.variables
      });
      
      // Reset form
      setEmailData({
        recipient: 'all',
        customRecipient: '',
        subject: '',
        content: '',
        template: '',
        variables: {}
      });
      
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      await createTemplate(newTemplate);
      setNewTemplate({
        name: '',
        type: 'newsletter',
        subject: '',
        content: '',
        variables: [],
        is_active: true,
        is_default: false
      });
      setShowCreateTemplate(false);
    } catch (error) {
      console.error('Create template error:', error);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;
    
    try {
      await updateTemplate(editingTemplate.id, editingTemplate);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Update template error:', error);
    }
  };

  const getTypeInfo = (type: string) => {
    return EMAIL_TYPES.find(t => t.value === type) || EMAIL_TYPES[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Loading email management...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Management</h1>
        <p className="text-gray-600">Manage email templates and send messages to your users</p>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Compose Email</TabsTrigger>
          <TabsTrigger value="templates">Email Templates ({templates.length})</TabsTrigger>
          <TabsTrigger value="history">Email History ({emailHistory.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Compose Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipients</Label>
                  <Select value={emailData.recipient} onValueChange={(value) => setEmailData({...emailData, recipient: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="customers">All Customers</SelectItem>
                      <SelectItem value="subscribers">Newsletter Subscribers</SelectItem>
                      <SelectItem value="custom">Custom Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {emailData.recipient === 'custom' && (
                  <div>
                    <Label htmlFor="customRecipient">Email Address</Label>
                    <Input
                      id="customRecipient"
                      type="email"
                      placeholder="user@example.com"
                      value={emailData.customRecipient}
                      onChange={(e) => setEmailData({...emailData, customRecipient: e.target.value})}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="template">Use Template (Optional)</Label>
                  <Select value={emailData.template} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Email subject line"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Email Content (HTML)</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your email content here... You can use HTML tags and variables like {{user_name}}"
                    className="min-h-[300px] font-mono text-sm"
                    value={emailData.content}
                    onChange={(e) => setEmailData({...emailData, content: e.target.value})}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setPreviewMode(!previewMode)} variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    {previewMode ? 'Edit' : 'Preview'}
                  </Button>
                  <Button onClick={handleSendEmail} disabled={isLoading} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    {isLoading ? 'Sending...' : 'Send Email'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white min-h-[400px]">
                  <div className="mb-4 pb-4 border-b">
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>From:</strong> noreply@shopease.com
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>To:</strong> {emailData.recipient === 'custom' ? emailData.customRecipient : emailData.recipient}
                    </div>
                    <div className="text-lg font-semibold">
                      <strong>Subject:</strong> {emailData.subject || 'Email Subject'}
                    </div>
                  </div>
                  
                  {previewMode ? (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: emailData.content || '<p>Email content will appear here...</p>' }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 overflow-auto">
                      {emailData.content || 'Email content will appear here...'}
                    </pre>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Email Templates
                </span>
                <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Email Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Template Name</Label>
                          <Input
                            value={newTemplate.name}
                            onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                            placeholder="Template name"
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select value={newTemplate.type} onValueChange={(value: any) => setNewTemplate({...newTemplate, type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {EMAIL_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Input
                          value={newTemplate.subject}
                          onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                          placeholder="Email subject"
                        />
                      </div>
                      <div>
                        <Label>Content</Label>
                        <Textarea
                          value={newTemplate.content}
                          onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                          placeholder="Email content (HTML supported)"
                          className="min-h-[200px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateTemplate}>Create Template</Button>
                        <Button variant="outline" onClick={() => setShowCreateTemplate(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => {
                  const typeInfo = getTypeInfo(template.type);
                  return (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <div className="flex gap-2">
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                          {template.is_default && (
                            <Badge variant="outline">Default</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          Use Template
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingTemplate(template)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {!template.is_default && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Email History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {emailHistory.length > 0 ? (
                <div className="space-y-4">
                  {emailHistory.map((email) => (
                    <div key={email.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{email.subject}</h4>
                          <Badge variant={email.status === 'sent' ? 'default' : 'destructive'}>
                            {email.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(email.created_at)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>To:</strong> {email.recipient_email || email.recipient_type}</p>
                        {email.sent_at && <p><strong>Sent:</strong> {formatDate(email.sent_at)}</p>}
                        {email.error_message && (
                          <p className="text-red-600"><strong>Error:</strong> {email.error_message}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No emails sent yet. Your email history will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Template Dialog */}
      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Template: {editingTemplate.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Template Name</Label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Subject</Label>
                <Input
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                  className="min-h-[300px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateTemplate}>Update Template</Button>
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
