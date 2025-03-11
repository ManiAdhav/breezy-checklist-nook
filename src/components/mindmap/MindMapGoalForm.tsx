
import React, { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { useVision } from '@/contexts/VisionContext';
import { ThreeYearGoal, GoalStatus, Vision } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon, Target, Flag, Flame, Gift, Heart, Key, Layers, Lightbulb, Package, Rocket, Star, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface MindMapGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingGoal: ThreeYearGoal | null;
}

const iconOptions = [
  { value: 'Target', icon: Target },
  { value: 'Flag', icon: Flag },
  { value: 'Flame', icon: Flame },
  { value: 'Gift', icon: Gift },
  { value: 'Heart', icon: Heart },
  { value: 'Key', icon: Key },
  { value: 'Layers', icon: Layers },
  { value: 'Lightbulb', icon: Lightbulb },
  { value: 'Package', icon: Package },
  { value: 'Rocket', icon: Rocket },
  { value: 'Star', icon: Star },
];

// Actions interface
interface ActionItem {
  id: string;
  text: string;
}

const MindMapGoalForm: React.FC<MindMapGoalFormProps> = ({ isOpen, onClose, editingGoal }) => {
  const { addThreeYearGoal, updateThreeYearGoal } = useGoal();
  const { visions, addVision } = useVision();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000)); // 3 years from now
  const [status, setStatus] = useState<GoalStatus>('not_started');
  const [selectedIcon, setSelectedIcon] = useState<string>('Target');
  const [iconPopoverOpen, setIconPopoverOpen] = useState(false);
  
  // Vision-related states
  const [selectedVisionId, setSelectedVisionId] = useState<string>('');
  const [newVisionName, setNewVisionName] = useState('');
  const [isCreatingVision, setIsCreatingVision] = useState(false);
  const [visionAreaOfLife, setVisionAreaOfLife] = useState('career');
  
  // Action items
  const [actions, setActions] = useState<ActionItem[]>([
    { id: uuidv4(), text: '' },
    { id: uuidv4(), text: '' }
  ]);
  
  // Reset form and pick random icon when dialog opens/closes or editing goal changes
  useEffect(() => {
    if (isOpen) {
      if (editingGoal) {
        setTitle(editingGoal.title);
        setDescription(editingGoal.description || '');
        setStartDate(new Date(editingGoal.startDate));
        setEndDate(new Date(editingGoal.endDate));
        setStatus(editingGoal.status);
        setSelectedIcon(editingGoal.icon || getRandomIcon());
        
        // Prefill with example actions if editing
        setActions([
          { id: uuidv4(), text: 'Research required skills' },
          { id: uuidv4(), text: 'Create a timeline' }
        ]);
      } else {
        setTitle('');
        setDescription('');
        setStartDate(new Date());
        setEndDate(new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000));
        setStatus('not_started');
        setSelectedIcon(getRandomIcon());
        setSelectedVisionId(visions.length > 0 ? visions[0].id : '');
        setActions([
          { id: uuidv4(), text: '' },
          { id: uuidv4(), text: '' }
        ]);
      }
    }
  }, [isOpen, editingGoal, visions]);
  
  const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * iconOptions.length);
    return iconOptions[randomIndex].value;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Goal title is required",
        variant: "destructive",
      });
      return;
    }
    
    // Create new vision if needed
    if (isCreatingVision && newVisionName.trim()) {
      const newVision = {
        title: newVisionName.trim(),
        areaOfLife: visionAreaOfLife,
        targetDate: endDate,
        status: 'not_started' as GoalStatus
      };
      
      addVision(newVision);
      toast({
        title: "Vision created",
        description: "New vision has been created and linked to your goal"
      });
    }
    
    // Filter out empty actions
    const validActions = actions.filter(action => action.text.trim() !== '');
    
    const goalData = {
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate,
      status,
      icon: selectedIcon,
      // We don't actually save actions here as they would be tasks in the real app
    };
    
    if (editingGoal) {
      updateThreeYearGoal(editingGoal.id, goalData);
      toast({
        title: "Goal updated",
        description: "Your goal has been updated in the mind map"
      });
    } else {
      addThreeYearGoal(goalData);
      toast({
        title: "Goal created",
        description: "Your new goal has been added to the mind map"
      });
    }
    
    onClose();
  };
  
  const handleIconSelect = (iconValue: string) => {
    setSelectedIcon(iconValue);
    setIconPopoverOpen(false);
  };
  
  const handleActionChange = (id: string, value: string) => {
    setActions(prevActions => 
      prevActions.map(action => 
        action.id === id ? { ...action, text: value } : action
      )
    );
    
    // If the last action has some text, add a new empty action
    const lastAction = actions[actions.length - 1];
    if (lastAction && lastAction.id === id && value.trim() && actions.length < 5) {
      setActions(prev => [...prev, { id: uuidv4(), text: '' }]);
    }
  };
  
  const handleRemoveAction = (id: string) => {
    if (actions.length <= 2) {
      toast({
        title: "Cannot remove action",
        description: "You need at least two actions for a goal",
        variant: "destructive"
      });
      return;
    }
    
    setActions(prevActions => prevActions.filter(action => action.id !== id));
  };
  
  const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'abandoned', label: 'Abandoned' }
  ];
  
  const areaOfLifeOptions = [
    { value: 'career', label: 'Career' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'finance', label: 'Finance' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'personal', label: 'Personal Growth' },
    { value: 'recreation', label: 'Recreation' }
  ];

  // Get the icon component based on the selected icon value
  const IconComponent = iconOptions.find(i => i.value === selectedIcon)?.icon || Target;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <IconComponent className="h-5 w-5 text-primary" />
            <span>{editingGoal ? 'Edit Goal' : 'Create Goal'}</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Popover open={iconPopoverOpen} onOpenChange={setIconPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="flex-shrink-0"
                    aria-label="Change icon"
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 pointer-events-auto" align="start">
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={option.value}
                          type="button"
                          variant={selectedIcon === option.value ? "default" : "outline"}
                          size="icon"
                          className={cn(
                            "h-10 w-10",
                            selectedIcon === option.value && "bg-primary text-primary-foreground"
                          )}
                          onClick={() => handleIconSelect(option.value)}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="sr-only">{option.value}</span>
                        </Button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            
              <Input
                placeholder="Goal name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base font-medium flex-1"
                autoFocus
              />
            </div>
            
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 resize-none"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as GoalStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Link to Vision</Label>
              {!isCreatingVision ? (
                <div className="flex items-center space-x-2">
                  <Select
                    value={selectedVisionId}
                    onValueChange={setSelectedVisionId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a vision" />
                    </SelectTrigger>
                    <SelectContent>
                      {visions.map((vision) => (
                        <SelectItem key={vision.id} value={vision.id}>
                          {vision.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreatingVision(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Vision name"
                    value={newVisionName}
                    onChange={(e) => setNewVisionName(e.target.value)}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Select
                      value={visionAreaOfLife}
                      onValueChange={setVisionAreaOfLife}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Area of life" />
                      </SelectTrigger>
                      <SelectContent>
                        {areaOfLifeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon"
                      onClick={() => setIsCreatingVision(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <Label>Actions to Achieve This Goal</Label>
              {actions.map((action, index) => (
                <div key={action.id} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Action ${index + 1}`}
                    value={action.text}
                    onChange={(e) => handleActionChange(action.id, e.target.value)}
                  />
                  {index >= 2 && (
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveAction(action.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary">
              {editingGoal ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MindMapGoalForm;
