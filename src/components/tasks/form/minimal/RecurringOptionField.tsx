
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecurringOptionFieldProps {
  recurring: boolean;
  setRecurring: (recurring: boolean) => void;
  recurringPattern: string;
  setRecurringPattern: (pattern: string) => void;
}

export const RecurringOptionField: React.FC<RecurringOptionFieldProps> = ({ 
  recurring, 
  setRecurring, 
  recurringPattern, 
  setRecurringPattern 
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Recurring Task</span>
        </div>
        <Switch 
          checked={recurring} 
          onCheckedChange={setRecurring}
        />
      </div>
      
      {recurring && (
        <Select value={recurringPattern} onValueChange={setRecurringPattern}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
