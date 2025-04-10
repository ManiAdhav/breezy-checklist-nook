
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface List {
  id: string;
  name: string;
}

interface ListFieldProps {
  listId: string;
  setListId: (listId: string) => void;
  allLists: List[];
}

export const ListField: React.FC<ListFieldProps> = ({ listId, setListId, allLists }) => {
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
