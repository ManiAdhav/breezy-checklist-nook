
import React from 'react';
import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ActionItemProps {
  action: Task;
  expandedTaskId: string | null;
  selectedTab: string;
  onToggleTaskCompletion: (id: string) => void;
  onToggleTaskDetails: (id: string) => void;
  onTabChange: (value: string) => void;
}

const ActionItem: React.FC<ActionItemProps> = ({
  action,
  expandedTaskId,
  selectedTab,
  onToggleTaskCompletion,
  onToggleTaskDetails,
  onTabChange
}) => {
  return (
    <div key={action.id} className="rounded-md border mb-2">
      <div 
        className="flex items-start p-2 hover:bg-accent/20 rounded-md cursor-pointer text-xs"
        onClick={() => onToggleTaskDetails(action.id)}
      >
        <Checkbox 
          checked={action.completed}
          className="mt-0.5 mr-2"
          onCheckedChange={() => onToggleTaskCompletion(action.id)}
          onClick={(e) => e.stopPropagation()}
        />
        
        <div className="flex-1 min-w-0">
          <div className="font-medium">{action.title}</div>
          
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            {action.startDate && action.dueDate && (
              <div className="flex items-center text-xs">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>
                  {format(new Date(action.startDate), 'MMM d')} - {format(new Date(action.dueDate), 'MMM d')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {expandedTaskId === action.id && (
        <div className="p-2 bg-muted/20 text-xs border-t">
          <Tabs defaultValue="milestones" value={selectedTab} onValueChange={onTabChange}>
            <TabsList className="w-full grid grid-cols-4 h-8">
              <TabsTrigger value="milestones" className="text-[10px]">Milestones</TabsTrigger>
              <TabsTrigger value="plans" className="text-[10px]">Plans</TabsTrigger>
              <TabsTrigger value="tasks" className="text-[10px]">Tasks</TabsTrigger>
              <TabsTrigger value="habits" className="text-[10px]">Habits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="milestones" className="p-2">
              <p className="text-muted-foreground">Associated milestones will appear here.</p>
            </TabsContent>
            
            <TabsContent value="plans" className="p-2">
              <p className="text-muted-foreground">Associated plans will appear here.</p>
            </TabsContent>
            
            <TabsContent value="tasks" className="p-2">
              <p className="text-muted-foreground">Associated tasks will appear here.</p>
            </TabsContent>
            
            <TabsContent value="habits" className="p-2">
              <p className="text-muted-foreground">Associated habits will appear here.</p>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ActionItem;
