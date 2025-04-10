
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesFieldProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const NotesField: React.FC<NotesFieldProps> = ({ notes, setNotes }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="task-notes">Notes</Label>
      <Textarea
        id="task-notes"
        placeholder="Add any additional notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
};
