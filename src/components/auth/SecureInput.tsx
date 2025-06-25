
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { sanitizeInput } from '@/components/security/InputSanitizer';

interface SecureInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  validation?: {
    pattern?: RegExp;
    message?: string;
    validator?: (value: string) => { isValid: boolean; errors: string[] };
  };
}

export function SecureInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength = 100,
  validation
}: SecureInputProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue);
    
    // Validate input
    let validationErrors: string[] = [];
    let valid = true;

    if (validation) {
      if (validation.pattern && !validation.pattern.test(sanitizedValue)) {
        validationErrors.push(validation.message || 'Invalid format');
        valid = false;
      }
      
      if (validation.validator) {
        const result = validation.validator(sanitizedValue);
        if (!result.isValid) {
          validationErrors.push(...result.errors);
          valid = false;
        }
      }
    }

    setErrors(validationErrors);
    setIsValid(valid);
    onChange(sanitizedValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={!isValid ? 'border-red-500' : ''}
      />
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ))}
        </div>
      )}
      {isValid && value && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          Input is secure
        </div>
      )}
    </div>
  );
}
