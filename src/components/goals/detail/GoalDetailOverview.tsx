
import React from 'react';
import { ListChecks, Repeat, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import ActionsSection from '../sections/ActionsSection';
import HabitSection from '../sections/HabitSection';
import MilestoneSection from '../sections/MilestoneSection';
import TaskSection from '../sections/TaskSection';

interface GoalDetailOverviewProps {
  goalId: string;
  onTabChange: (value: string) => void;
}

const GoalDetailOverview: React.FC<GoalDetailOverviewProps> = ({ goalId, onTabChange }) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Quick Overview of all sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Actions Section Summary */}
          <div className="border rounded-lg p-4 bg-card/50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium flex items-center">
                <ListChecks className="h-5 w-5 mr-2 text-blue-500" />
                Actions
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onTabChange("tasks")}
              >
                View All
              </Button>
            </div>
            <ActionsSection goalId={goalId} limit={3} />
          </div>
          
          {/* Habits Section Summary */}
          <div className="border rounded-lg p-4 bg-card/50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium flex items-center">
                <Repeat className="h-5 w-5 mr-2 text-green-500" />
                Habits
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onTabChange("habits")}
              >
                View All
              </Button>
            </div>
            <HabitSection goalId={goalId} limit={3} />
          </div>
          
          {/* Milestones Section Summary */}
          <div className="border rounded-lg p-4 bg-card/50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium flex items-center">
                <Flag className="h-5 w-5 mr-2 text-purple-500" />
                Milestones
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onTabChange("milestones")}
              >
                View All
              </Button>
            </div>
            <MilestoneSection goalId={goalId} limit={3} />
          </div>
          
          {/* Tasks Section Summary */}
          <div className="border rounded-lg p-4 bg-card/50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium flex items-center">
                <ListChecks className="h-5 w-5 mr-2 text-yellow-500" />
                Tasks
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onTabChange("tasks")}
              >
                View All
              </Button>
            </div>
            <TaskSection goalId={goalId} limit={3} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalDetailOverview;
