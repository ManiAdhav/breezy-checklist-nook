
import React, { useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface MinimalNotesFieldProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const MinimalNotesField: React.FC<MinimalNotesFieldProps> = ({ notes, setNotes }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize the textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
    }
  }, [notes]);
  
  return (
    <div>
      <Textarea
        ref={textareaRef}
        placeholder="Add notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[80px] resize-none transition-all duration-200 focus:border-primary"
        rows={3}
      />
    </div>
  );
};
