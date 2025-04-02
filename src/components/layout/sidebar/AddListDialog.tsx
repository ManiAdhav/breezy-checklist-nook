
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { List } from '@/types/task';
import IconSelector from '@/components/layout/sidebar/IconSelector';
import DynamicIcon from '@/components/ui/dynamic-icon';

interface AddListDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newListName: string;
  setNewListName: (name: string) => void;
  handleAddList: () => void;
  editingList: List | null;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
}

const AddListDialog: React.FC<AddListDialogProps> = ({
  isOpen,
  onOpenChange,
  newListName,
  setNewListName,
  handleAddList,
  editingList,
  selectedIcon,
  setSelectedIcon
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{editingList ? 'Edit List' : 'Add New List'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <IconSelector 
              selectedIcon={selectedIcon} 
              onSelectIcon={setSelectedIcon} 
            />
            <Input 
              id="list-name" 
              value={newListName} 
              onChange={e => setNewListName(e.target.value)} 
              className="flex-1" 
              placeholder="Enter list name"
              autoFocus 
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Selected icon: {selectedIcon}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddList} disabled={!newListName.trim()}>
            {editingList ? 'Save' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddListDialog;
