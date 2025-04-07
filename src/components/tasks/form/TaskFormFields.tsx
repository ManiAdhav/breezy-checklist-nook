
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; // Add missing Button import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Priority } from '@/types/task';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';
import TagSelector from '@/components/tags/TagSelector';

interface List {
  id: string;
  name: string;
}

export const TitleField: React.FC<{ title: string; setTitle: (title: string) => void }> = ({ title, setTitle }) => {
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

export const DueDateField: React.FC<{ dueDate?: Date; setDueDate: (date?: Date) => void }> = ({ dueDate, setDueDate }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="task-due-date">Due Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left"
          >
            {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={dueDate}
            onSelect={setDueDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const PriorityField: React.FC<{ priority: Priority; setPriority: (priority: Priority) => void }> = ({ priority, setPriority }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="task-priority">Priority</Label>
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger id="task-priority">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="none">None</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export const ListField: React.FC<{ listId: string; setListId: (listId: string) => void; allLists: List[] }> = ({ listId, setListId, allLists }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="task-list">List</Label>
      <Select value={listId} onValueChange={setListId}>
        <SelectTrigger id="task-list">
          <SelectValue placeholder="Select list" />
        </SelectTrigger>
        <SelectContent>
          {allLists.map(list => (
            <SelectItem key={list.id} value={list.id}>{list.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const NotesField: React.FC<{ notes: string; setNotes: (notes: string) => void }> = ({ notes, setNotes }) => {
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

export const TagsField: React.FC<{
  selectedTagIds: string[];
  setSelectedTagIds: (tagIds: string[]) => void;
}> = ({ selectedTagIds, setSelectedTagIds }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      <TagSelector
        selectedTagIds={selectedTagIds}
        onTagsChange={setSelectedTagIds}
      />
    </div>
  );
};
