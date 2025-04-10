
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface MinimalDueDateFieldProps {
  dueDate?: Date;
  setDueDate: (date?: Date) => void;
}

export const MinimalDueDateField: React.FC<MinimalDueDateFieldProps> = ({ dueDate, setDueDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-1 h-8 transition-colors duration-200 ${dueDate ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          {dueDate ? format(dueDate, 'MMM d') : 'Due date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dueDate}
          onSelect={(date) => {
            setDueDate(date);
            // Auto close popover after selection
            setTimeout(() => setIsOpen(false), 200);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
