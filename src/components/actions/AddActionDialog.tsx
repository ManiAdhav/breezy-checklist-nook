
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import ActionForm from './form/ActionForm';

interface AddActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddActionDialog: React.FC<AddActionDialogProps> = ({ open, onOpenChange }) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Action</DialogTitle>
        </DialogHeader>
        
        <ActionForm 
          onSuccess={handleClose}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddActionDialog;
