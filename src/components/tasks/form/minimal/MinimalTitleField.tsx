
import React from 'react';
import { Input } from "@/components/ui/input";

interface MinimalTitleFieldProps {
  title: string;
  setTitle: (title: string) => void;
}

export const MinimalTitleField: React.FC<MinimalTitleFieldProps> = ({ title, setTitle }) => {
  return (
    <div>
      <Input
        placeholder="What do you want to accomplish?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg border-none focus:ring-0 px-0 py-1 placeholder:text-gray-400"
      />
    </div>
  );
};
