
import React from 'react';
import { GoalStatus } from '@/types/task';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { milestoneStatusOptions } from '../constants/status-options';

interface StatusFieldProps {
  status: GoalStatus;
  setStatus: (status: GoalStatus) => void;
}

const StatusField: React.FC<StatusFieldProps> = ({
  status,
  setStatus
}) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Status</div>
      <Select
        value={status}
        onValueChange={(value) => setStatus(value as GoalStatus)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {milestoneStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusField;
