
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import { GoalStatus } from '@/types/task';

export const statusOptions = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'abandoned', label: 'Abandoned' }
];

interface StatusSelectorProps {
  status: GoalStatus;
  onStatusChange: (value: GoalStatus) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ status, onStatusChange }) => {
  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value as GoalStatus)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelector;
