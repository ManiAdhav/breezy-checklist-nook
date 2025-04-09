
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Priority } from '@/types/task';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';
import TagSelector from '@/components/tags/TagSelector';
import { 
  CalendarIcon, 
  FolderIcon, 
  AlertCircle,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface List {
  id: string;
  name: string;
}

// Original form fields for backward compatibility
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

// New minimal UI form fields
export const MinimalTitleField: React.FC<{ title: string; setTitle: (title: string) => void }> = ({ title, setTitle }) => {
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

export const MinimalDueDateField: React.FC<{ dueDate?: Date; setDueDate: (date?: Date) => void }> = ({ dueDate, setDueDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-1 h-8 transition-colors duration-200 ${dueDate ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          {dueDate ? format(dueDate, 'MMM d') : 'Due date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={dueDate}
          onSelect={(date) => {
            setDueDate(date);
            // Auto close popover after selection
            setTimeout(() => setIsOpen(false), 200);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export const MinimalPriorityField: React.FC<{ priority: Priority; setPriority: (priority: Priority) => void }> = ({ priority, setPriority }) => {
  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };
  
  const getPriorityBackground = (p: Priority) => {
    switch (p) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return '';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-1 h-8 transition-colors duration-200 ${getPriorityBackground(priority)}`}
        >
          <AlertCircle className={`h-3.5 w-3.5 ${getPriorityColor(priority)}`} />
          <span>Priority</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={priority} onValueChange={(value) => setPriority(value as Priority)}>
          <DropdownMenuRadioItem value="none" className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
            <span>None</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="low" className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
            <span>Low</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="medium" className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            <span>Medium</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="high" className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <span>High</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const MinimalListField: React.FC<{ listId: string; setListId: (listId: string) => void; allLists: List[] }> = ({ listId, setListId, allLists }) => {
  // Filter out Today and Planned lists
  const filteredLists = allLists.filter(list => !['today', 'planned'].includes(list.id));
  const selectedList = filteredLists.find(list => list.id === listId) || filteredLists[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 h-8 transition-colors duration-200 hover:bg-accent"
        >
          <FolderIcon className="h-3.5 w-3.5" />
          <span>{selectedList?.name || 'List'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={listId} onValueChange={setListId}>
          {filteredLists.map(list => (
            <DropdownMenuRadioItem key={list.id} value={list.id} className="flex items-center gap-2">
              <FolderIcon className="h-3.5 w-3.5" />
              <span>{list.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const MinimalNotesField: React.FC<{ notes: string; setNotes: (notes: string) => void }> = ({ notes, setNotes }) => {
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

export const MinimalTagsField: React.FC<{
  selectedTagIds: string[];
  setSelectedTagIds: (tagIds: string[]) => void;
}> = ({ selectedTagIds, setSelectedTagIds }) => {
  return (
    <div>
      <TagSelector
        selectedTagIds={selectedTagIds}
        onTagsChange={setSelectedTagIds}
        enableAutoCreate={true}
      />
    </div>
  );
};

export const RecurringOptionField: React.FC<{
  recurring: boolean;
  setRecurring: (recurring: boolean) => void;
  recurringPattern: string;
  setRecurringPattern: (pattern: string) => void;
}> = ({ recurring, setRecurring, recurringPattern, setRecurringPattern }) => {
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
