
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TitleFieldProps {
  title: string;
  setTitle: (title: string) => void;
}

export const TitleField: React.FC<TitleFieldProps> = ({ title, setTitle }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="task-title">Title</Label>
      <Input
        id="task-title"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
};
