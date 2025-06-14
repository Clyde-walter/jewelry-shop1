
import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmailTemplate } from '@/types/email';
import { CreateTemplateForm } from './CreateTemplateForm';
import { EditTemplateForm } from './EditTemplateForm';

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

interface EmailTemplatesManagerProps {
  templates: EmailTemplate[];
  onCreateTemplate: (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateTemplate: (id: string, template: Partial<EmailTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
  onUseTemplate: (templateId: string) => void;
}

export function EmailTemplatesManager({ 
  templates, 
  onCreateTemplate, 
  onUpdateTemplate, 
  onDeleteTemplate, 
  onUseTemplate 
}: EmailTemplatesManagerProps) {
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const getTypeInfo = (type: string) => {
    return EMAIL_TYPES.find(t => t.value === type) || EMAIL_TYPES[0];
  };

  return (
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
              <CreateTemplateForm 
                onSubmit={onCreateTemplate}
                onCancel={() => setShowCreateTemplate(false)}
                emailTypes={EMAIL_TYPES}
              />
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
                    onClick={() => onUseTemplate(template.id)}
                    className="font-semibold text-primary hover:bg-primary/10"
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
                      onClick={() => onDeleteTemplate(template.id)}
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

      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Template: {editingTemplate.name}</DialogTitle>
            </DialogHeader>
            <EditTemplateForm 
              template={editingTemplate}
              onSubmit={(updates) => onUpdateTemplate(editingTemplate.id, updates)}
              onCancel={() => setEditingTemplate(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
