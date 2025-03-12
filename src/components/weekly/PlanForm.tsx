
import React, { useState, useEffect } from 'react';
import { Plan, GoalStatus } from '@/types/task';
import { useGoal } from '@/contexts/GoalContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface PlanFormProps {
  initialPlan: Plan | null;
  onClose: () => void;
}

const PlanForm: React.FC<PlanFormProps> = ({ initialPlan, onClose }) => {
  const { addPlan, updatePlan, ninetyDayTargets } = useGoal();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<GoalStatus>('not_started');
  const [targetId, setTargetId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialPlan) {
      setTitle(initialPlan.title);
      setDescription(initialPlan.description || '');
      setStartDate(format(new Date(initialPlan.startDate), 'yyyy-MM-dd'));
      setEndDate(format(new Date(initialPlan.endDate), 'yyyy-MM-dd'));
      setStatus(initialPlan.status);
      setTargetId(initialPlan.ninetyDayTargetId);
    } else {
      // Default values for new plan
      setTitle('');
      setDescription('');
      setStartDate(format(new Date(), 'yyyy-MM-dd'));
      setEndDate(format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
      setStatus('not_started');
      setTargetId(ninetyDayTargets.length > 0 ? ninetyDayTargets[0].id : '');
    }
  }, [initialPlan, ninetyDayTargets]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!targetId) {
      newErrors.targetId = 'Target is required';
    }
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (endDate < startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const planData = {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        ninetyDayTargetId: targetId,
      };
      
      if (initialPlan) {
        await updatePlan(initialPlan.id, planData);
      } else {
        await addPlan(planData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter plan title"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter plan description"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={errors.startDate ? 'border-red-500' : ''}
          />
          {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={errors.endDate ? 'border-red-500' : ''}
          />
          {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as GoalStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="abandoned">Abandoned</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="targetId">90-Day Target</Label>
        <Select 
          value={targetId} 
          onValueChange={setTargetId}
          disabled={ninetyDayTargets.length === 0}
        >
          <SelectTrigger className={errors.targetId ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a target" />
          </SelectTrigger>
          <SelectContent>
            {ninetyDayTargets.length === 0 ? (
              <SelectItem value="none" disabled>No targets available</SelectItem>
            ) : (
              ninetyDayTargets.map((target) => (
                <SelectItem key={target.id} value={target.id}>
                  {target.title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.targetId && <p className="text-sm text-red-500">{errors.targetId}</p>}
        {ninetyDayTargets.length === 0 && (
          <p className="text-sm text-yellow-600">You need to create a 90-day target first</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || ninetyDayTargets.length === 0}
        >
          {isSubmitting ? 'Saving...' : initialPlan ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
};

export default PlanForm;
