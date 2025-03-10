
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Filter, ListFilter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, ThreeYearGoal } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import { format, isPast, isToday, isThisWeek, addDays } from 'date-fns';

type FilterTimeframe = 'all' | 'today' | 'week' | 'overdue';
type SortOption = 'goal' | 'dueDate' | 'priority';

const ActionsList: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, toggleTaskCompletion } = useTask();
  const { threeYearGoals } = useGoal();
  const [selectedGoalId, setSelectedGoalId] = useState<string | 'all'>('all');
  const [timeframeFilter, setTimeframeFilter] = useState<FilterTimeframe>('all');
  const [sortBy, setSortBy] = useState<SortOption>('goal');
  const [showFilters, setShowFilters] = useState(false);

  // Filter tasks with weeklyGoalId (connected to goals)
  const goalTasks = tasks.filter(task => 
    task.weeklyGoalId && 
    !task.completed
  );

  // Filter by selected goal
  const filterByGoal = (task: Task): boolean => {
    if (selectedGoalId === 'all') return true;
    
    // Find the weekly goal associated with this task
    const weeklyGoal = threeYearGoals
      .flatMap(goal => goal.targets || [])
      .flatMap(target => target.weeklyGoals || [])
      .find(goal => goal.id === task.weeklyGoalId);
    
    // Find the target associated with the weekly goal
    const target = threeYearGoals
      .flatMap(goal => goal.targets || [])
      .find(t => t.weeklyGoals?.some(wg => wg.id === task.weeklyGoalId));
    
    // Find the goal associated with the target
    const goal = threeYearGoals
      .find(g => g.targets?.some(t => t.id === target?.id));
    
    return goal?.id === selectedGoalId;
  };

  // Filter by timeframe
  const filterByTimeframe = (task: Task): boolean => {
    if (!task.dueDate) return timeframeFilter === 'all';
    
    const dueDate = new Date(task.dueDate);
    
    switch (timeframeFilter) {
      case 'today':
        return isToday(dueDate);
      case 'week':
        return isThisWeek(dueDate, { weekStartsOn: 1 });
      case 'overdue':
        return isPast(dueDate) && !isToday(dueDate);
      case 'all':
      default:
        return true;
    }
  };

  // Apply all filters
  const filteredTasks = goalTasks
    .filter(filterByGoal)
    .filter(filterByTimeframe);

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && b.dueDate) return 1;
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && !b.dueDate) return 0;
        return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
      
      case 'priority': {
        const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      case 'goal':
      default:
        // Group by goal
        const aGoalId = getGoalIdForTask(a);
        const bGoalId = getGoalIdForTask(b);
        return aGoalId.localeCompare(bGoalId);
    }
  });

  // Helper to get the goal ID for a task
  function getGoalIdForTask(task: Task): string {
    const weeklyGoal = threeYearGoals
      .flatMap(goal => goal.targets || [])
      .flatMap(target => target.weeklyGoals || [])
      .find(goal => goal.id === task.weeklyGoalId);
    
    const target = threeYearGoals
      .flatMap(goal => goal.targets || [])
      .find(t => t.weeklyGoals?.some(wg => wg.id === task.weeklyGoalId));
    
    const goal = threeYearGoals
      .find(g => g.targets?.some(t => t.id === target?.id));
    
    return goal?.id || '';
  }

  // Helper to get the goal for a task
  function getGoalForTask(task: Task): ThreeYearGoal | undefined {
    const target = threeYearGoals
      .flatMap(goal => goal.targets || [])
      .find(t => t.weeklyGoals?.some(wg => wg.id === task.weeklyGoalId));
    
    return threeYearGoals
      .find(g => g.targets?.some(t => t.id === target?.id));
  }

  // Helper to navigate to the goal detail page
  const navigateToGoal = (task: Task) => {
    const goal = getGoalForTask(task);
    if (goal) {
      navigate(`/goals?goalId=${goal.id}`);
    }
  };

  // Group tasks by goal for display
  const tasksByGoal: { [goalId: string]: { goal: ThreeYearGoal, tasks: Task[] } } = {};
  
  sortedTasks.forEach(task => {
    const goal = getGoalForTask(task);
    if (goal) {
      if (!tasksByGoal[goal.id]) {
        tasksByGoal[goal.id] = { goal, tasks: [] };
      }
      tasksByGoal[goal.id].tasks.push(task);
    }
  });

  return (
    <div className="space-y-2 p-2">
      {/* Filter controls */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Action Items</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {showFilters && (
        <div className="space-y-2 mb-3 p-2 bg-muted/30 rounded-md">
          <div className="space-y-1">
            <label className="text-xs font-medium">Goal</label>
            <Select 
              value={selectedGoalId} 
              onValueChange={(value) => setSelectedGoalId(value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All Goals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Goals</SelectItem>
                {threeYearGoals.map(goal => (
                  <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium">Timeframe</label>
            <Select 
              value={timeframeFilter} 
              onValueChange={(value: FilterTimeframe) => setTimeframeFilter(value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium">Sort By</label>
            <Select 
              value={sortBy} 
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Group by Goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goal">Group by Goal</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {/* Tasks list */}
      <div className="max-h-[50vh] overflow-y-auto">
        {Object.keys(tasksByGoal).length > 0 ? (
          Object.values(tasksByGoal).map(({ goal, tasks }) => (
            <Collapsible key={goal.id} defaultOpen={true} className="mb-2">
              <CollapsibleTrigger className="flex items-center w-full justify-between p-2 text-xs font-medium hover:bg-accent/30 rounded">
                <span>{goal.title}</span>
                <span className="text-[10px] bg-secondary rounded-full px-1.5 py-0.5 min-w-5 text-center">
                  {tasks.length}
                </span>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="pl-2 space-y-1 mt-1">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className="flex items-start p-1.5 hover:bg-accent/20 rounded-md cursor-pointer text-xs"
                      onClick={() => navigateToGoal(task)}
                    >
                      <Checkbox 
                        checked={task.completed}
                        className="mt-0.5 mr-2"
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{task.title}</div>
                        
                        {task.dueDate && (
                          <div className="flex items-center text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground text-sm">
            {goalTasks.length === 0 
              ? "No action items found. Create tasks in your goals." 
              : "No action items match your filters."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionsList;
