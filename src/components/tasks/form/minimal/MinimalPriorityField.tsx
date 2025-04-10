
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Priority } from '@/types/task';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MinimalPriorityFieldProps {
  priority: Priority;
  setPriority: (priority: Priority) => void;
}

export const MinimalPriorityField: React.FC<MinimalPriorityFieldProps> = ({ priority, setPriority }) => {
  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };
  
  const getPriorityBackground = (p: Priority) => {
    switch (p) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return '';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-1 h-8 transition-colors duration-200 ${getPriorityBackground(priority)}`}
        >
          <AlertCircle className={`h-3.5 w-3.5 ${getPriorityColor(priority)}`} />
          <span>Priority</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={priority} onValueChange={(value) => setPriority(value as Priority)}>
          <DropdownMenuRadioItem value="none" className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
            <span>None</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="low" className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
            <span>Low</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="medium" className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            <span>Medium</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="high" className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <span>High</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
