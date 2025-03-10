
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Filter, ListFilter, Plus, Target, Flag, ListChecks, Repeat } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, ThreeYearGoal } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import { format, isPast, isToday, isThisWeek, addDays } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

type FilterTimeframe = 'all' | 'today' | 'week' | 'overdue';
type SortOption = 'goal' | 'dueDate' | 'priority';

const ActionsList: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, toggleTaskCompletion, addTask } = useTask();
  const { threeYearGoals, weeklyGoals, ninetyDayTargets } = useGoal();
  const [selectedGoalId, setSelectedGoalId] = useState<string | 'all'>('all');
  const [timeframeFilter, setTimeframeFilter] = useState<FilterTimeframe>('all');
  const [sortBy, setSortBy] = useState<SortOption>('goal');
  const [showFilters, setShowFilters] = useState(false);
  
  // New state for add action dialog
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [selectedGoalForAction, setSelectedGoalForAction] = useState('');
  const [selectedWeeklyGoalId, setSelectedWeeklyGoalId] = useState('');
  const [actionStartDate, setActionStartDate] = useState<Date>(new Date());
  const [actionEndDate, setActionEndDate] = useState<Date>(addDays(new Date(), 7));
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Filter tasks that are actions (with weeklyGoalId and isAction flag)
  const actionTasks = tasks.filter(task => 
    task.weeklyGoalId && 
    !task.completed &&
    task.isAction
  );

  // Filter regular goal tasks (with weeklyGoalId but no isAction flag)
  const goalTasks = tasks.filter(task => 
    task.weeklyGoalId && 
    !task.completed &&
    !task.isAction
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
  const filteredTasks = actionTasks
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

  // Handle add action submit
  const handleAddAction = () => {
    if (!newActionTitle.trim()) {
      toast({
        title: "Error",
        description: "Action title is required",
        variant: "destructive",
      });
      return;
    }

    if (!selectedWeeklyGoalId) {
      toast({
        title: "Error",
        description: "Please select a plan for this action",
        variant: "destructive",
      });
      return;
    }

    const newAction: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: newActionTitle,
      completed: false,
      priority: 'medium',
      listId: 'inbox',
      weeklyGoalId: selectedWeeklyGoalId,
      startDate: actionStartDate,
      dueDate: actionEndDate,
      isAction: true,
    };

    addTask(newAction);
    
    toast({
      title: "Action added",
      description: "Your new action has been added successfully",
    });
    
    setNewActionTitle('');
    setSelectedGoalForAction('');
    setSelectedWeeklyGoalId('');
    setActionStartDate(new Date());
    setActionEndDate(addDays(new Date(), 7));
    setIsAddActionOpen(false);
  };

  // Get all the weekly goals for a selected three year goal
  const getWeeklyGoalsForGoal = (goalId: string) => {
    const goal = threeYearGoals.find(g => g.id === goalId);
    if (!goal) return [];
    
    return goal.targets?.flatMap(target => target.weeklyGoals || []) || [];
  };

  // Toggle task details expansion
  const toggleTaskDetails = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
  };

  return (
    <div className="space-y-2 p-2">
      {/* Filter controls */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Action Items</h3>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-primary" 
            onClick={() => setIsAddActionOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
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
                    <div key={task.id} className="rounded-md border mb-2">
                      <div 
                        className="flex items-start p-2 hover:bg-accent/20 rounded-md cursor-pointer text-xs"
                        onClick={() => toggleTaskDetails(task.id)}
                      >
                        <Checkbox 
                          checked={task.completed}
                          className="mt-0.5 mr-2"
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{task.title}</div>
                          
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            {task.startDate && (
                              <div className="flex items-center text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{format(new Date(task.startDate), 'MMM d')} - {format(new Date(task.dueDate || task.startDate), 'MMM d')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {expandedTaskId === task.id && (
                        <div className="p-2 bg-muted/20 text-xs border-t">
                          <Tabs defaultValue="milestones" value={selectedTab} onValueChange={setSelectedTab}>
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
                          
                          <div className="mt-2 flex justify-end">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-[10px] h-7"
                              onClick={() => navigateToGoal(task)}
                            >
                              View in Goal
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground text-sm">
            {actionTasks.length === 0 
              ? "No action items found. Create new actions with the + button." 
              : "No action items match your filters."}
          </div>
        )}
      </div>
      
      {/* Add Action Dialog */}
      <Dialog open={isAddActionOpen} onOpenChange={setIsAddActionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Action</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="action-title">Action Name</Label>
              <Input
                id="action-title"
                value={newActionTitle}
                onChange={(e) => setNewActionTitle(e.target.value)}
                placeholder="Enter action title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-select">Associated Goal</Label>
              <Select 
                value={selectedGoalForAction} 
                onValueChange={(value) => {
                  setSelectedGoalForAction(value);
                  setSelectedWeeklyGoalId(''); // Reset weekly goal when goal changes
                }}
              >
                <SelectTrigger id="goal-select">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  {threeYearGoals.map(goal => (
                    <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedGoalForAction && (
              <div className="space-y-2">
                <Label htmlFor="plan-select">Associated Plan</Label>
                <Select 
                  value={selectedWeeklyGoalId} 
                  onValueChange={setSelectedWeeklyGoalId}
                >
                  <SelectTrigger id="plan-select">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {getWeeklyGoalsForGoal(selectedGoalForAction).map(weeklyGoal => (
                      <SelectItem key={weeklyGoal.id} value={weeklyGoal.id}>{weeklyGoal.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(actionStartDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={actionStartDate}
                      onSelect={(date) => date && setActionStartDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(actionEndDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={actionEndDate}
                      onSelect={(date) => date && setActionEndDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddActionOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAction}>Add Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionsList;
