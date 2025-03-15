
import React, { useState } from 'react';
import { 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { icons } from 'lucide-react';
import { GoalStatus, Priority, ThreeYearGoal } from '@/types/task';

import { VisionSelector } from '@/components/goals/form';
import StatusSelector from '@/components/goals/form/StatusSelector';
import DatePicker from '@/components/goals/form/DatePicker';
import IconSelector from './IconSelector';
import ActionsList from './ActionsList';

export interface Action {
  id: number;
  text: string;
}

interface GoalFormProps {
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  status: string;
  icon: keyof typeof icons;
  visionId: string;
  actions: Action[];
  isEditing: boolean;
  
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onStatusChange: (value: string) => void;
  onIconChange: (value: keyof typeof icons) => void;
  onVisionChange: (value: string) => void;
  
  onAddAction: () => void;
  onUpdateAction: (id: number, text: string) => void;
  onRemoveAction: (id: number) => void;
  
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({
  title,
  description,
  startDate,
  endDate,
  status,
  icon,
  visionId,
  actions,
  isEditing,
  
  onTitleChange,
  onDescriptionChange,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onIconChange,
  onVisionChange,
  
  onAddAction,
  onUpdateAction,
  onRemoveAction,
  
  onCancel,
  onSubmit,
}) => {
  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
        <DialogDescription>Create a meaningful goal to track your progress</DialogDescription>
      </DialogHeader>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <IconSelector 
              selectedIcon={icon} 
              onSelectIcon={(value) => onIconChange(value as keyof typeof icons)} 
            />
          </div>
          
          <div className="flex-1">
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Goal title"
              className="text-lg"
            />
          </div>
        </div>
        
        <StatusSelector 
          status={status as GoalStatus} 
          onStatusChange={(value) => onStatusChange(value)} 
        />
        
        <VisionSelector visionId={visionId} onVisionChange={onVisionChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="Start Date"
            date={startDate || new Date()}
            onDateChange={onStartDateChange}
          />
          
          <DatePicker
            label="End Date"
            date={endDate || new Date()}
            onDateChange={onEndDateChange}
          />
        </div>
        
        <div>
          <Label htmlFor="goal-description">Description</Label>
          <Textarea
            id="goal-description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter goal description"
          />
        </div>
        
        <ActionsList
          actions={actions}
          onAddAction={onAddAction}
          onUpdateAction={onUpdateAction}
          onRemoveAction={onRemoveAction}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Goal' : 'Create Goal'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default GoalForm;
