
import React from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DueDateFieldProps {
  dueDate?: Date;
  setDueDate: (date?: Date) => void;
}

export const DueDateField: React.FC<DueDateFieldProps> = ({ dueDate, setDueDate }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="task-due-date">Due Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left"
          >
            {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={setDueDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
