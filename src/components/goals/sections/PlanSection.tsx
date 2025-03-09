
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Target, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlanSectionProps {
  goalId: string;
}

// Placeholder data for demonstration
const demoPlans = [
  { 
    id: 'p1', 
    title: 'Research and gather materials',
    description: 'Collect all necessary resources, books, and online materials to start the learning process.',
    priority: 'high' as const
  },
  { 
    id: 'p2', 
    title: 'Create a structured learning schedule',
    description: 'Develop a weekly schedule with dedicated time blocks for different aspects of the subject.',
    priority: 'medium' as const
  },
  { 
    id: 'p3', 
    title: 'Find study partners or communities',
    description: 'Join online forums, local groups, or find study partners to enhance learning through collaboration.',
    priority: 'low' as const
  },
];

const PlanSection: React.FC<PlanSectionProps> = ({ goalId }) => {
  const [plans, setPlans] = useState(demoPlans);
  
  const getPriorityClasses = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Strategies to achieve your goal</p>
        <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-lg">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Plan
        </Button>
      </div>
      
      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground mb-2 text-sm">No plans yet</p>
          <Button variant="outline" size="sm" className="mt-1">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Your First Plan
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map(plan => (
            <div 
              key={plan.id}
              className="p-3.5 border border-border rounded-lg bg-card hover:bg-card/80 transition-colors"
            >
              <div className="flex justify-between">
                <div className="font-medium flex items-center text-sm">
                  <Target className="h-4 w-4 mr-2 text-primary" />
                  {plan.title}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive cursor-pointer">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {plan.description && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {plan.description}
                </p>
              )}
              
              <div className="mt-3 flex items-center">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityClasses(plan.priority)}`}>
                  {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)} Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanSection;
