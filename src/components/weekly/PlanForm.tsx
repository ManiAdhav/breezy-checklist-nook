
import React, { useState } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { Plan, GoalStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface PlanFormProps {
  onClose: () => void;
  plan?: Plan | null;
  targetId?: string;
}

const PlanForm: React.FC<PlanFormProps> = ({ onClose, plan, targetId }) => {
  const { addPlan, updatePlan, ninetyDayTargets } = useGoal();
  const [formData, setFormData] = useState<Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>>({
    title: plan?.title || '',
    description: plan?.description || '',
    status: plan?.status || 'not_started',
    startDate: plan?.startDate || new Date(),
    endDate: plan?.endDate || new Date(),
    ninetyDayTargetId: plan?.ninetyDayTargetId || targetId || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as GoalStatus }));
  };

  const handleTargetChange = (value: string) => {
    setFormData(prev => ({ ...prev, ninetyDayTargetId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert('Title is required');
      return;
    }

    try {
      if (plan) {
        await updatePlan(plan.id, formData);
      } else {
        await addPlan(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-4 rounded-md border shadow-sm">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Plan title"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Plan description"
          className="h-24"
        />
      </div>

      <div>
        <Label htmlFor="target">90-Day Target</Label>
        <Select 
          value={formData.ninetyDayTargetId} 
          onValueChange={handleTargetChange}
          disabled={!!targetId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a target" />
          </SelectTrigger>
          <SelectContent>
            {ninetyDayTargets.map(target => (
              <SelectItem key={target.id} value={target.id}>
                {target.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={handleStatusChange}>
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

      <div className="flex gap-2">
        <Button type="submit">{plan ? 'Update' : 'Create'} Plan</Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PlanForm;
