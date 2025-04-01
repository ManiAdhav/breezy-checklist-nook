
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { List } from '@/types/task';
import DynamicIcon from '@/components/ui/dynamic-icon';

interface SidebarListProps {
  openEditDialog: (list: List) => void;
  handleListClick: (listId: string) => void;
  selectedListId: string | null;
  setIsAddListOpen: (open: boolean) => void;
  setNewListName: (name: string) => void;
  setEditingList: (list: List | null) => void;
  setSelectedIcon: (icon: string) => void;
}

const SidebarList: React.FC<SidebarListProps> = ({
  openEditDialog,
  handleListClick,
  selectedListId,
  setIsAddListOpen,
  setNewListName,
  setEditingList,
  setSelectedIcon
}) => {
  const { customLists, deleteList, tasks } = useTask();
  const [showCustomLists, setShowCustomLists] = useState(true);

  const getTaskCountForList = (listId: string) => {
    return tasks.filter(task => task.listId === listId && !task.completed).length;
  };

  return (
    <div className="mt-2">
      <div 
        className="flex items-center px-2 py-1 text-xs font-medium text-foreground cursor-pointer hover:bg-accent/30 rounded-md" 
        onClick={() => setShowCustomLists(!showCustomLists)}
      >
        {showCustomLists ? <ChevronDown className="h-3.5 w-3.5 mr-1" /> : <ChevronRight className="h-3.5 w-3.5 mr-1" />}
        <span>Lists</span>
      </div>

      {showCustomLists && (
        <nav className="mt-0.5 space-y-0.5">
          {customLists.map(list => (
            <div key={list.id} className="group relative">
              <Button 
                variant="ghost" 
                className={`w-full justify-start h-8 px-2 py-1 text-xs sidebar-item ${selectedListId === list.id && location.pathname === '/' ? 'sidebar-item-active' : ''}`} 
                onClick={() => handleListClick(list.id)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <DynamicIcon name={list.icon || 'List'} className="h-4 w-4" />
                  <span className="mr-auto">{list.name}</span>
                </div>
                {getTaskCountForList(list.id) > 0 && (
                  <span className="text-[9px] bg-secondary rounded-full px-1 py-0.5 min-w-4 text-center ml-1">
                    {getTaskCountForList(list.id)}
                  </span>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => openEditDialog(list)}>Rename</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteList(list.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}

          <Button 
            variant="ghost" 
            className="w-full justify-start h-8 px-2 py-1 text-xs sidebar-item hover:bg-accent/50" 
            onClick={() => {
              setNewListName('');
              setEditingList(null);
              setSelectedIcon('List');
              setIsAddListOpen(true);
            }}
          >
            <DynamicIcon name="Plus" className="h-4 w-4 mr-2" />
            <span>Add List</span>
          </Button>
        </nav>
      )}
    </div>
  );
};

export default SidebarList;
