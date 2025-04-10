
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useGoal } from '@/contexts/GoalContext';
import { useHabit } from '@/contexts/HabitContext';
import { Habit } from '@/types/habit';
import { useToast } from '@/hooks/use-toast';
import HabitIconSelector from './form/HabitIconSelector';
import MetricSelector, { METRIC_OPTIONS } from './form/MetricSelector';
import FrequencySelector from './form/FrequencySelector';
import DateAndGoalSelector from './form/DateAndGoalSelector';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editHabit?: Habit;
}

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
  const [timeOfDay, setTimeOfDay] = useState('anytime');
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
        setFrequency(editHabit.frequency || 'daily');
        setSelectedDays(editHabit.selectedDays || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
        setTimeOfDay(editHabit.timeOfDay || 'anytime');
        setEndDate(editHabit.endDate);
      } else {
        setName('');
        setMetric('steps');
        setMetricValue('');
        setCustomMetric('');
        setGoalId('none');
        setSelectedIcon('Activity');
        setFrequency('daily');
        setSelectedDays(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
        setTimeOfDay('anytime');
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
          icon: selectedIcon,
          frequency,
          selectedDays,
          timeOfDay,
          endDate
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
          icon: selectedIcon,
          frequency,
          selectedDays,
          timeOfDay,
          endDate
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
      setTimeOfDay('anytime');
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
            <HabitIconSelector
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
              showIconSelector={showIconSelector}
              toggleIconSelector={toggleIconSelector}
            />
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
          
          <Separator className="my-4" />
          
          <MetricSelector
            metric={metric}
            setMetric={setMetric}
            metricValue={metricValue}
            setMetricValue={setMetricValue}
            customMetric={customMetric}
            setCustomMetric={setCustomMetric}
          />
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <FrequencySelector
              frequency={frequency}
              setFrequency={setFrequency}
              selectedDays={selectedDays}
              toggleDaySelection={toggleDaySelection}
              timeOfDay={timeOfDay}
              setTimeOfDay={setTimeOfDay}
            />
            
            <DateAndGoalSelector
              endDate={endDate}
              setEndDate={setEndDate}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              goalId={goalId}
              setGoalId={setGoalId}
              goals={threeYearGoals || []}
            />
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
