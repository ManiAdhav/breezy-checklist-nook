
import React from 'react';
import { Priority } from '@/types/task';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriorityFieldProps {
  priority: Priority;
  setPriority: (priority: Priority) => void;
}

export const PriorityField: React.FC<PriorityFieldProps> = ({ priority, setPriority }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="task-priority">Priority</Label>
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger id="task-priority">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="none">None</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
