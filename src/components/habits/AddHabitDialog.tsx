
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check, Goal, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoal } from '@/contexts/GoalContext';
import { useHabit } from '@/contexts/HabitContext';
import { Habit } from '@/types/habit';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editHabit?: Habit;
}

// List of common habit icons to choose from
const HABIT_ICONS = [
  'Activity', 'AlarmClock', 'Apple', 'Baby', 'Barbell', 'Bath', 'Beef',
  'Beer', 'Book', 'BrainCircuit', 'Briefcase', 'Building', 'Bus', 'Calculator',
  'Calendar', 'Camera', 'Car', 'Carrot', 'ChefHat', 'Cigarette', 'ClipboardList',
  'Clock', 'Cloud', 'Code', 'Coffee', 'Compass', 'CreditCard', 'Drumstick',
  'Dumbbell', 'Egg', 'FileText', 'Film', 'Flame', 'Gamepad2', 'Gift', 'GlassWater',
  'Globe', 'Handshake', 'Heart', 'Home', 'Laptop', 'Leaf', 'Library', 'LightbulbOff',
  'Meditation', 'Milestone', 'Microphone', 'Moon', 'Mountain', 'Bike', 'Music',
  'Newspaper', 'PaintBucket', 'Pencil', 'Pill', 'Plant', 'Running', 'School', 
  'ShoppingBag', 'ShoppingCart', 'Shower', 'Sleep', 'Smartphone', 'Smoking', 
  'SunMedium', 'Target', 'Timer', 'Trophy', 'Utensils', 'Video', 'Wallet', 
  'Water', 'Wine', 'Yoga'
];

// Predefined metric options
const METRIC_OPTIONS = [
  'steps',
  'minutes',
  'hours',
  'times',
  'pages',
  'glasses',
  'repetitions',
  'sessions',
  'kilometers',
  'miles',
  'custom'
];

// Frequency options
const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

// Days of the week
const DAYS_OF_WEEK = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ 
  open, 
  onOpenChange, 
  editHabit 
}) => {
  // Get needed context hooks
  const { threeYearGoals } = useGoal();
  const { addHabit, updateHabit } = useHabit();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [metric, setMetric] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [customMetric, setCustomMetric] = useState('');
  const [goalId, setGoalId] = useState('none');
  const [selectedIcon, setSelectedIcon] = useState('Activity');
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Reset form when dialog opens/closes or editing habit changes
  React.useEffect(() => {
    if (open) {
      if (editHabit) {
        setName(editHabit.name);
        
        // Check if metric is one of our predefined options
        if (METRIC_OPTIONS.includes(editHabit.metric)) {
          setMetric(editHabit.metric);
          setCustomMetric('');
        } else {
          setMetric('custom');
          setCustomMetric(editHabit.metric);
        }
        
        setGoalId(editHabit.goalId || 'none');
        setSelectedIcon(editHabit.icon || 'Activity');
        // We would set frequency, selectedDays and endDate here too if they were part of the habit type
      } else {
        setName('');
        setMetric('steps');
        setMetricValue('');
        setCustomMetric('');
        setGoalId('none');
        setSelectedIcon('Activity');
        setFrequency('daily');
        setSelectedDays(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
        setEndDate(undefined);
      }
      setShowIconSelector(false);
      setShowDatePicker(false);
    }
  }, [open, editHabit]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    // Determine the final metric value
    const finalMetric = metric === 'custom' ? customMetric : metric;
    
    if (!finalMetric.trim()) return;
    
    try {
      if (editHabit) {
        updateHabit(editHabit.id, {
          name,
          metric: finalMetric,
          goalId: goalId !== 'none' ? goalId : undefined,
          icon: selectedIcon
          // We would add frequency, selectedDays and endDate here too if they were part of the habit type
        });
        toast({
          title: "Habit updated",
          description: `${name} has been updated successfully.`
        });
      } else {
        addHabit({
          name,
          metric: finalMetric,
          goalId: goalId !== 'none' ? goalId : undefined,
          tags: [],
          icon: selectedIcon
          // We would add frequency, selectedDays and endDate here too if they were part of the habit type
        });
        toast({
          title: "Habit added",
          description: `${name} has been added to your habits.`
        });
      }
      
      // Reset and close
      setName('');
      setMetric('steps');
      setMetricValue('');
      setCustomMetric('');
      setGoalId('none');
      setSelectedIcon('Activity');
      setFrequency('daily');
      setSelectedDays(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
      setEndDate(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error('Error handling habit:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your habit. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleIconSelector = () => {
    setShowIconSelector(!showIconSelector);
  };

  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      // Don't allow deselecting if it's the last selected day
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editHabit ? 'Edit Habit' : 'Add New Habit'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={toggleIconSelector}
            >
              <DynamicIcon name={selectedIcon} className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Enter habit name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-primary/20 focus-visible:ring-primary"
              />
            </div>
          </div>
          
          {showIconSelector && (
            <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
              <div className="grid grid-cols-6 gap-2">
                {HABIT_ICONS.map((icon) => (
                  <div
                    key={icon}
                    className={`p-2 rounded-md cursor-pointer hover:bg-primary/10 flex items-center justify-center ${
                      selectedIcon === icon ? 'bg-primary/20 ring-1 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setSelectedIcon(icon);
                      setShowIconSelector(false);
                    }}
                  >
                    <DynamicIcon name={icon} className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="space-y-3">
              <Label htmlFor="metric" className="text-muted-foreground text-xs font-normal">
                How will you measure this?
              </Label>
              
              <div className="flex gap-3 items-center">
                <div className="w-20">
                  <Input
                    placeholder="Amount"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    type="number"
                    min="0"
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </div>
                <div className="flex-1">
                  <Select value={metric} onValueChange={(value) => setMetric(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a metric" />
                    </SelectTrigger>
                    <SelectContent>
                      {METRIC_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === 'custom' ? 'Custom metric...' : option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {metric === 'custom' && (
                <Input
                  placeholder="Enter custom metric"
                  value={customMetric}
                  onChange={(e) => setCustomMetric(e.target.value)}
                  required
                  className="mt-2"
                />
              )}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs font-normal">How often?</Label>
                
                <RadioGroup 
                  value={frequency}
                  onValueChange={setFrequency}
                  className="flex flex-wrap gap-4"
                >
                  {FREQUENCY_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {frequency === 'weekly' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <Button
                        key={day.value}
                        type="button"
                        variant={selectedDays.includes(day.value) ? "default" : "outline"}
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => toggleDaySelection(day.value)}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      type="button"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {endDate ? format(endDate, 'MMM d, yyyy') : 'End date (optional)'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setShowDatePicker(false);
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Select value={goalId} onValueChange={(value) => setGoalId(value)}>
                <SelectTrigger className="bg-background border-muted w-10">
                  <DynamicIcon name="Goal" className="h-4 w-4 text-muted-foreground" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {threeYearGoals && threeYearGoals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-6">
            {editHabit ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Habit
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
