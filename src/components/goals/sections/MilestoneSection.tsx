
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle2, Circle, Calendar, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MilestoneSectionProps {
  goalId: string;
}

// Placeholder data for demonstration
const demoMilestones = [
  { 
    id: 'm1', 
    title: 'Research the topic thoroughly', 
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
    status: 'completed' as const 
  },
  { 
    id: 'm2', 
    title: 'Create detailed outline', 
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), 
    status: 'in_progress' as const 
  },
  { 
    id: 'm3', 
    title: 'First draft completion', 
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 
    status: 'not_started' as const 
  },
];

const MilestoneSection: React.FC<MilestoneSectionProps> = ({ goalId }) => {
  const [milestones, setMilestones] = useState(demoMilestones);
  
  const getStatusClasses = (status: 'not_started' | 'in_progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-100';
      case 'in_progress':
        return 'text-blue-500 bg-blue-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };
  
  const toggleMilestoneStatus = (id: string) => {
    setMilestones(prev => 
      prev.map(milestone => {
        if (milestone.id === id) {
          const newStatus = 
            milestone.status === 'not_started' ? 'in_progress' :
            milestone.status === 'in_progress' ? 'completed' : 'not_started';
          
          return { ...milestone, status: newStatus };
        }
        return milestone;
      })
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Key checkpoints for your goal</p>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add Milestone
        </Button>
      </div>
      
      {milestones.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-md">
          <p className="text-muted-foreground mb-2">No milestones yet</p>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Milestone
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {milestones.map(milestone => (
            <div 
              key={milestone.id}
              className="flex items-start p-3 border border-border rounded-md bg-card"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 mr-2 rounded-full ${
                  milestone.status === 'completed' ? 'text-green-500' :
                  milestone.status === 'in_progress' ? 'text-blue-500' : 'text-gray-500'
                }`}
                onClick={() => toggleMilestoneStatus(milestone.id)}
              >
                {milestone.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 fill-green-500" />
                ) : milestone.status === 'in_progress' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${milestone.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                  {milestone.title}
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>Target: {format(new Date(milestone.targetDate), 'MMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-center mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClasses(milestone.status)}`}>
                    {milestone.status === 'not_started' ? 'Not Started' :
                     milestone.status === 'in_progress' ? 'In Progress' : 'Completed'}
                  </span>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MilestoneSection;
