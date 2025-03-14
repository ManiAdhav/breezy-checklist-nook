
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ActionPlanHeaderProps {
  planTitle: string;
  targetTitle?: string;
}

const ActionPlanHeader: React.FC<ActionPlanHeaderProps> = ({ planTitle, targetTitle }) => {
  return (
    <div className="px-4 py-2 bg-muted/20 border-b">
      <div className="flex items-center">
        <ChevronRight className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
        <p className="text-xs font-medium">{planTitle}</p>
      </div>
      {targetTitle && (
        <p className="text-xs text-muted-foreground ml-5 mt-0.5">
          {targetTitle}
        </p>
      )}
    </div>
  );
};

export default ActionPlanHeader;
