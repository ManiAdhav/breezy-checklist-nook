
import React from 'react';
import { FolderIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface List {
  id: string;
  name: string;
}

interface MinimalListFieldProps {
  listId: string;
  setListId: (listId: string) => void;
  allLists: List[];
}

export const MinimalListField: React.FC<MinimalListFieldProps> = ({ listId, setListId, allLists }) => {
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
