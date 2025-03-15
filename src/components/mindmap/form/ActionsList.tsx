
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface Action {
  id: number;
  text: string;
}

interface ActionsListProps {
  actions: Action[];
  onAddAction: () => void;
  onUpdateAction: (id: number, text: string) => void;
  onRemoveAction: (id: number) => void;
}

const ActionsList: React.FC<ActionsListProps> = ({
  actions,
  onAddAction,
  onUpdateAction,
  onRemoveAction,
}) => {
  return (
    <div>
      <Label>Actions</Label>
      <div className="space-y-2">
        {actions.map(action => (
          <div key={action.id} className="flex items-center space-x-2">
            <Input
              type="text"
              value={action.text}
              onChange={(e) => onUpdateAction(action.id, e.target.value)}
              placeholder="Enter action"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveAction(action.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={onAddAction}>
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
      </div>
    </div>
  );
};

export default ActionsList;
