
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionFieldProps {
  description: string;
  setDescription: (value: string) => void;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({
  description,
  setDescription
}) => {
  return (
    <Textarea
      placeholder="Description (optional)"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="min-h-24 resize-none"
    />
  );
};

export default DescriptionField;
