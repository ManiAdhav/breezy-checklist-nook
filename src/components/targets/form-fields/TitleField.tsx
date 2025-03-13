
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

interface TitleFieldProps {
  title: string;
  setTitle: (value: string) => void;
  placeholder?: string;
}

const TitleField: React.FC<TitleFieldProps> = ({
  title,
  setTitle,
  placeholder = "Title"
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-md pointer-events-none"
        >
          <Target className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1">
        <Input
          placeholder={placeholder}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium"
          autoFocus
          required
        />
      </div>
    </div>
  );
};

export default TitleField;
