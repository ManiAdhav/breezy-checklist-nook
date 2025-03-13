
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionFieldProps {
  description: string;
  setDescription: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({
  description,
  setDescription,
  placeholder = "Description (optional)",
  maxLength = 500,
  className = "min-h-24 resize-none"
}) => {
  const characterCount = description.length;
  const isApproachingLimit = characterCount > (maxLength * 0.8);
  const isAtLimit = characterCount >= maxLength;
  
  return (
    <div className="space-y-1">
      <Textarea
        placeholder={placeholder}
        value={description}
        onChange={(e) => {
          const newValue = e.target.value;
          if (!maxLength || newValue.length <= maxLength) {
            setDescription(newValue);
          }
        }}
        className={className}
        maxLength={maxLength}
      />
      {maxLength > 0 && (
        <div className={`text-xs text-right ${
          isAtLimit ? 'text-destructive' : 
          isApproachingLimit ? 'text-amber-500' : 
          'text-muted-foreground'
        }`}>
          {characterCount}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default DescriptionField;
