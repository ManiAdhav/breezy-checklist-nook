import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { List, Priority } from '@/types/task';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

interface TitleFieldProps {
  title: string;
  setTitle: (title: string) => void;
}

export const TitleField: React.FC<TitleFieldProps> = ({ title, setTitle }) => (
  <div className="grid gap-2">
    <Label htmlFor="title">Task</Label>
    <Input
      id="title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="What needs to be done?"
      autoFocus
    />
  </div>
);

interface DueDateFieldProps {
  dueDate: Date | undefined;
  setDueDate: (date: Date | undefined) => void;
}

export const DueDateField: React.FC<DueDateFieldProps> = ({ dueDate, setDueDate }) => {
  const handleDateSelect = (date: Date | undefined) => {
    // If selecting the same date, clear it
    if (date && dueDate && date.getTime() === dueDate.getTime()) {
      setDueDate(undefined);
    } else {
      setDueDate(date);
    }
  };

  return (
    <div className="grid gap-2">
      <Label>Due Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dueDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={handleDateSelect}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface PriorityFieldProps {
  priority: Priority;
  setPriority: (priority: Priority) => void;
}

export const PriorityField: React.FC<PriorityFieldProps> = ({ priority, setPriority }) => (
  <div className="grid gap-2">
    <Label htmlFor="priority">Priority</Label>
    <Select 
      value={priority} 
      onValueChange={(value) => setPriority(value as Priority)}
    >
      <SelectTrigger id="priority">
        <SelectValue placeholder="Select priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

interface ListFieldProps {
  listId: string;
  setListId: (listId: string) => void;
  allLists: List[];
}

export const ListField: React.FC<ListFieldProps> = ({ listId, setListId, allLists }) => (
  <div className="grid gap-2">
    <Label htmlFor="list">List</Label>
    <Select 
      value={listId} 
      onValueChange={setListId}
    >
      <SelectTrigger id="list">
        <SelectValue placeholder="Select list" />
      </SelectTrigger>
      <SelectContent>
        {allLists.map(list => (
          <SelectItem key={list.id} value={list.id}>
            {list.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

interface NotesFieldProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const NotesField: React.FC<NotesFieldProps> = ({ notes, setNotes }) => (
  <div className="grid gap-2">
    <Label htmlFor="notes">Notes</Label>
    <Textarea
      id="notes"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Add notes (optional)"
      rows={3}
    />
  </div>
);
