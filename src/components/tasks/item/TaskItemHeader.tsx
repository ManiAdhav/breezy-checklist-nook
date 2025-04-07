
import React from 'react';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface TaskItemHeaderProps {
  title: string;
  listId: string;
  completed: boolean;
  showTaskInfo: () => void;
}

const TaskItemHeader: React.FC<TaskItemHeaderProps> = ({
  title,
  listId,
  completed,
  showTaskInfo
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className={cn(
        "font-medium text-sm mb-1 break-words",
        completed && "line-through text-muted-foreground"
      )}>
        {title}
      </p>
      
      <div className="text-xs text-muted-foreground/70 flex items-center">
        <span>List: {listId}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-5 w-5 ml-1 p-0"
                onClick={showTaskInfo}
              >
                <Info className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show task details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TaskItemHeader;
