
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EmailTemplate } from '@/types/email';

interface EditTemplateFormProps {
  template: EmailTemplate;
  onSubmit: (updates: Partial<EmailTemplate>) => void;
  onCancel: () => void;
}

export function EditTemplateForm({ template, onSubmit, onCancel }: EditTemplateFormProps) {
  const [editingTemplate, setEditingTemplate] = useState(template);

  const handleSubmit = () => {
    onSubmit(editingTemplate);
  };

  return (
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
        <Button onClick={handleSubmit}>Update Template</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
