
import React from 'react';
import { GoalStatus } from '@/types/task';

interface StatusIndicatorProps {
  status: GoalStatus;
  getStatusColor: (status: GoalStatus) => string;
  getStatusLabel: (status: GoalStatus) => string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  getStatusColor, 
  getStatusLabel 
}) => {
  return (
    <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-1.5 ${getStatusColor(status)}`}></div>
        <span>{getStatusLabel(status)}</span>
      </div>
    </div>
  );
};

export default StatusIndicator;
