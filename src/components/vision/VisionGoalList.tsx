
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GoalForm from '@/components/goals/GoalForm';
import { useGoal } from '@/hooks/useGoalContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface VisionGoalListProps {
  visionId: string;
}

const VisionGoalList: React.FC<VisionGoalListProps> = ({ visionId }) => {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoal();
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const { isMobile } = useIsMobile();

  const filteredGoals = goals.filter(goal =>
    goal.visionId === visionId &&
    goal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGoal = (newGoal: { title: string; description: string; }) => {
    addGoal({ ...newGoal, visionId: visionId });
    setIsAddGoalDialogOpen(false);
  };

  const handleEditGoal = (goalId: string, updatedGoal: { title: string; description: string; }) => {
    updateGoal(goalId, updatedGoal);
    setEditingGoalId(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId);
  };

  const openEditDialog = (goalId: string) => {
    setEditingGoalId(goalId);
  };

  const closeEditDialog = () => {
    setEditingGoalId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Goals</h2>
        <Button variant="action" onClick={() => setIsAddGoalDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <Input
        type="text"
        placeholder="Search goals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {filteredGoals.length === 0 ? (
        <p>No goals found for this vision.</p>
      ) : (
        <ul>
          {filteredGoals.map(goal => (
            <li key={goal.id} className="mb-2 p-4 border rounded-md shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{goal.title}</h3>
                  <p className="text-gray-600">{goal.description}</p>
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(goal.id)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteGoal(goal.id)}>Delete</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <GoalForm 
            onSave={handleAddGoal}
            onCancel={() => setIsAddGoalDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editingGoalId !== null} onOpenChange={(open) => { if (!open) closeEditDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          {editingGoalId && (
            <GoalForm
              onSave={(updatedGoal) => handleEditGoal(editingGoalId, updatedGoal)}
              onCancel={closeEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisionGoalList;
