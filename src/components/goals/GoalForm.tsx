
import React, { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { useVision } from '@/contexts/VisionContext';
import { ThreeYearGoal, GoalStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import IconSelector, { getIconComponent, getRandomIcon } from './form/IconSelector';
import DatePicker from './form/DatePicker';
import StatusSelector from './form/StatusSelector';
import VisionSelector from './form/VisionSelector';
import FormHeader from './form/FormHeader';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingGoal: ThreeYearGoal | null;
}

const GoalForm: React.FC<GoalFormProps> = ({ isOpen, onClose, editingGoal }) => {
  const { addThreeYearGoal, updateThreeYearGoal } = useGoal();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000)); // 3 years from now
  const [status, setStatus] = useState<GoalStatus>('not_started');
  const [selectedIcon, setSelectedIcon] = useState<string>('Target');
  const [visionId, setVisionId] = useState<string>('');
  
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
        setVisionId(editingGoal.visionId || '');
      } else {
        setTitle('');
        setDescription('');
        setStartDate(new Date());
        setEndDate(new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000));
        setStatus('not_started');
        setSelectedIcon(getRandomIcon());
        setVisionId('');
      }
    }
  }, [isOpen, editingGoal]);
  
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
    
    const goalData = {
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate,
      status,
      icon: selectedIcon,
      visionId: visionId || undefined
    };
    
    if (editingGoal) {
      updateThreeYearGoal(editingGoal.id, goalData);
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully",
      });
    } else {
      addThreeYearGoal(goalData);
      toast({
        title: "Goal created",
        description: "Your new goal has been created",
      });
    }
    
    onClose();
  };
  
  // Get the icon component based on the selected icon value
  const IconComponent = getIconComponent(selectedIcon);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] animate-scale-in">
        <FormHeader 
          title={editingGoal ? 'Edit Goal' : 'Create Goal'} 
          icon={IconComponent} 
        />
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <IconSelector 
                selectedIcon={selectedIcon} 
                onSelectIcon={setSelectedIcon} 
              />
              
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
            
            <VisionSelector 
              visionId={visionId} 
              onVisionChange={setVisionId} 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePicker 
                label="Start Date" 
                date={startDate} 
                onDateChange={(date) => date && setStartDate(date)} 
              />
              
              <DatePicker 
                label="Target Date" 
                date={endDate} 
                onDateChange={(date) => date && setEndDate(date)} 
              />
            </div>
            
            <StatusSelector 
              status={status} 
              onStatusChange={setStatus} 
            />
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

export default GoalForm;
