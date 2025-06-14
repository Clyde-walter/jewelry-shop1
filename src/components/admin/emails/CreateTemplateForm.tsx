
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmailTemplate } from '@/types/email';

interface CreateTemplateFormProps {
  onSubmit: (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  emailTypes: Array<{ value: string; label: string; color: string }>;
}

export function CreateTemplateForm({ onSubmit, onCancel, emailTypes }: CreateTemplateFormProps) {
  const [template, setTemplate] = useState({
    name: '',
    type: 'newsletter' as any,
    subject: '',
    content: '',
    variables: [] as string[],
    is_active: true,
    is_default: false
  });

  const handleSubmit = () => {
    onSubmit(template);
    setTemplate({
      name: '',
      type: 'newsletter',
      subject: '',
      content: '',
      variables: [],
      is_active: true,
      is_default: false
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Template Name</Label>
          <Input
            value={template.name}
            onChange={(e) => setTemplate({...template, name: e.target.value})}
            placeholder="Template name"
          />
        </div>
        <div>
          <Label>Type</Label>
          <Select value={template.type} onValueChange={(value: any) => setTemplate({...template, type: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {emailTypes.map((type) => (
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
          value={template.subject}
          onChange={(e) => setTemplate({...template, subject: e.target.value})}
          placeholder="Email subject"
        />
      </div>
      <div>
        <Label>Content</Label>
        <Textarea
          value={template.content}
          onChange={(e) => setTemplate({...template, content: e.target.value})}
          placeholder="Email content (HTML supported)"
          className="min-h-[200px]"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit}>Create Template</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
