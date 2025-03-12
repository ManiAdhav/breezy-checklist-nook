
import React from 'react';
import { Task } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ActionsViewProps {
  tasks: Task[];
}

const ActionsView: React.FC<ActionsViewProps> = ({ tasks }) => {
  const { toggleTaskCompletion, deleteTask } = useTask();

  // Group tasks by planId
  const tasksByPlan: { [key: string]: Task[] } = {};
  tasks.forEach(task => {
    if (!task.isAction) return; // Only process action items
    if (!tasksByPlan[task.planId || 'unassigned']) {
      tasksByPlan[task.planId || 'unassigned'] = [];
    }
    tasksByPlan[task.planId || 'unassigned'].push(task);
  });

  return (
    <div className="space-y-4">
      {Object.entries(tasksByPlan).map(([planId, tasks]) => (
        <div key={planId} className="border rounded-md shadow-sm">
          <div className="px-4 py-2 bg-muted/50 border-b">
            <h3 className="text-sm font-medium">
              {planId === 'unassigned' ? 'Unassigned Actions' : `Actions for Plan ${planId}`}
            </h3>
          </div>
          <ul className="divide-y">
            {tasks.map(task => (
              <li key={task.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    id={`task-${task.id}`}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className="ml-2 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {task.title}
                  </label>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => deleteTask(task.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ActionsView;
