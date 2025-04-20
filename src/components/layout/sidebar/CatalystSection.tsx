
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Target, 
  Calendar, 
  Archive, 
  Lightbulb, 
  ListChecks 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import GoalActionsPopover from './GoalActionsPopover';

const CatalystSection: React.FC = () => {
  const [showGoals, setShowGoals] = useState(true);
  const { threeYearGoals } = useGoal();
  const { tasks } = useTask();

  const actionTasksCount = tasks.filter(task => 
    task.isAction && 
    !task.completed
  ).length;

  const goalsWithActions = threeYearGoals.filter(goal => {
    const goalTasks = tasks.filter(task => {
      return task.goalId === goal.id && !task.completed;
    });
    
    return goalTasks.length > 0;
  });

  return (
    <div>
      <div className="flex items-center px-2 py-1 text-xs font-medium text-foreground cursor-pointer mt-2 hover:bg-accent/30 rounded-md" onClick={() => setShowGoals(!showGoals)}>
        {showGoals ? <ChevronDown className="h-3.5 w-3.5 mr-1" /> : <ChevronRight className="h-3.5 w-3.5 mr-1" />}
        <span>Catalyst</span>
      </div>
      
      {showGoals && (
        <div className="ml-1 space-y-0.5">
          <Link to="/vision" className="block">
            <Button variant="ghost" className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/vision' ? 'sidebar-item-active' : ''}`}>
              <Lightbulb className="h-4 w-4 mr-2" />
              <span>Vision</span>
            </Button>
          </Link>
          
          <Link to="/goals" className="block">
            <Button variant="ghost" className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/goals' ? 'sidebar-item-active' : ''}`}>
              <Target className="h-4 w-4 mr-2" />
              <span>Goals</span>
            </Button>
          </Link>

          <Link to="/actions" className="block">
            <Button 
              variant="ghost" 
              className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/actions' ? 'sidebar-item-active' : ''}`}
            >
              <ListChecks className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium mr-auto">Actions</span>
              {actionTasksCount > 0 && (
                <span className="text-[9px] bg-secondary rounded-full px-1 py-0.5 min-w-4 text-center">
                  {actionTasksCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Link to="/milestones" className="block">
            <Button variant="ghost" className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/milestones' ? 'sidebar-item-active' : ''}`}>
              <Archive className="h-4 w-4 mr-2" />
              <span>Milestone</span>
            </Button>
          </Link>
          
          {goalsWithActions.map(goal => {
            const goalTasks = tasks.filter(task => {
              return task.goalId === goal.id && !task.completed;
            });
            
            if (goalTasks.length === 0) return null;
            
            return (
              <GoalActionsPopover 
                key={goal.id} 
                goal={goal} 
                goalTasks={goalTasks} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CatalystSection;
