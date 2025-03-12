import React, { useState } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { useTask } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { Plan, GoalStatus, Task } from '@/types/task';
import { 
  ArrowLeft, CheckCircle, Clock, Target, Calendar, 
  Edit, Trash2, PlusCircle, CheckSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Tag from '@/components/ui/Tag';
import PlanSection from '@/components/goals/sections/PlanSection';
import { toast } from '@/hooks/use-toast';

interface PlanDetailViewProps {
  plan: Plan;
  onBack: () => void;
  onEdit: (plan: Plan) => void;
}

const PlanDetailView: React.FC<PlanDetailViewProps> = ({ plan, onBack, onEdit }) => {
  const { ninetyDayTargets, deletePlan, updatePlan } = useGoal();
  const { tasks, addTask, toggleTaskCompletion } = useTask();
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  
  // Find the parent target
  const parentTarget = ninetyDayTargets.find(target => target.id === plan.ninetyDayTargetId);
  
  // Get tasks related to this plan
  const planTasks = tasks.filter(task => task.planId === plan.id);
  
  const getStatusColor = (status: GoalStatus): string => {
    const colors = {
      not_started: '#6B7280', // gray
      in_progress: '#60A5FA', // blue
      completed: '#34D399', // green
      abandoned: '#F87171', // red
    };
    return colors[status];
  };

  const getStatusLabel = (status: GoalStatus): string => {
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      completed: 'Completed',
      abandoned: 'Abandoned',
    };
    return labels[status];
  };
  
  const handleStatusChange = (newStatus: GoalStatus) => {
    updatePlan(plan.id, { status: newStatus });
    toast({
      title: "Plan status updated",
      description: `Plan status changed to ${getStatusLabel(newStatus)}`,
    });
  };
  
  const handleDelete = () => {
    deletePlan(plan.id);
    setIsDeleteConfirmOpen(false);
    onBack();
    toast({
      title: "Plan deleted",
      description: "The plan has been deleted successfully",
      variant: "destructive",
    });
  };
  
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    addTask({
      title: newTaskTitle,
      notes: newTaskNotes || undefined,
      completed: false,
      priority: 'medium',
      listId: 'inbox',
      planId: plan.id,
      isAction: true
    });
    
    setNewTaskTitle('');
    setNewTaskNotes('');
    setIsAddTaskOpen(false);
    
    toast({
      title: "Task added",
      description: "Task has been added to this plan",
    });
  };
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="py-4 px-6 flex justify-between items-center border-b border-border sticky top-0 bg-background z-10">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">Plan Details</h2>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage plan details
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onEdit(plan)}
            className="flex items-center"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span>Edit Plan</span>
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{plan.title}</h2>
              
              {plan.description && (
                <div className="text-muted-foreground mb-6 leading-relaxed">
                  {plan.description}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Time Period</div>
                    <div className="text-muted-foreground">
                      {format(new Date(plan.startDate), 'PPP')} - {format(new Date(plan.endDate), 'PPP')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Parent Target</div>
                    <div className="text-muted-foreground">
                      {parentTarget ? parentTarget.title : 'No parent target'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex space-x-2">
                  {(['not_started', 'in_progress', 'completed', 'abandoned'] as GoalStatus[]).map((status) => (
                    <Button
                      key={status}
                      variant={plan.status === status ? "default" : "outline"}
                      size="sm"
                      className="h-8"
                      onClick={() => handleStatusChange(status)}
                    >
                      {status === 'not_started' && <Clock className="h-3.5 w-3.5 mr-1" />}
                      {status === 'in_progress' && <Target className="h-3.5 w-3.5 mr-1" />}
                      {status === 'completed' && <CheckCircle className="h-3.5 w-3.5 mr-1" />}
                      {status === 'abandoned' && <Trash2 className="h-3.5 w-3.5 mr-1" />}
                      {getStatusLabel(status)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Tasks</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddTaskOpen(true)}
                  className="flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <span>Add Task</span>
                </Button>
              </div>
              
              {planTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <CheckSquare className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No tasks yet for this plan</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setIsAddTaskOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    <span>Add your first task</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {planTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="flex items-center p-3 border border-border rounded-md"
                    >
                      <Checkbox 
                        checked={task.completed} 
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </div>
                        {task.notes && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {task.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Plan Information</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Created</div>
                  <div className="text-muted-foreground">
                    {format(new Date(plan.createdAt), 'PPP')}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Last Updated</div>
                  <div className="text-muted-foreground">
                    {format(new Date(plan.updatedAt), 'PPP')}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Status</div>
                  <Tag 
                    text={getStatusLabel(plan.status)} 
                    color={getStatusColor(plan.status)}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <PlanSection goalId={plan.id} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this plan? This action cannot be undone and will also remove any tasks associated with this plan.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Task to Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-notes">Notes (Optional)</Label>
              <Textarea
                id="task-notes"
                value={newTaskNotes}
                onChange={(e) => setNewTaskNotes(e.target.value)}
                placeholder="Enter any additional details"
                className="min-h-24 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanDetailView;
