
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isEditing,
  submitLabel,
  cancelLabel = "Cancel"
}) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="submit">
        {submitLabel || (isEditing ? 'Save' : 'Add')}
      </Button>
    </DialogFooter>
  );
};

export default FormActions;
