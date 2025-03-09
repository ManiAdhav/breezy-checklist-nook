
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Inbox, Calendar, CalendarClock, ListChecks, PlusCircle, 
  ChevronDown, ChevronRight, MoreHorizontal, User, Briefcase,
  Target, Goal, CalendarCheck
} from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { List } from '@/types/task';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    lists, 
    customLists, 
    selectedListId, 
    setSelectedListId,
    addList,
    updateList,
    deleteList,
    tasks,
  } = useTask();

  const [showCustomLists, setShowCustomLists] = useState(true);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState<List | null>(null);

  const getIconForList = (icon: string | undefined) => {
    switch (icon) {
      case 'inbox': return <Inbox className="h-4 w-4" />;
      case 'calendar': return <Calendar className="h-4 w-4" />;
      case 'calendar-clock': return <CalendarClock className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      case 'briefcase': return <Briefcase className="h-4 w-4" />;
      default: return <ListChecks className="h-4 w-4" />;
    }
  };

  const getTaskCountForList = (listId: string) => {
    return tasks.filter(task => task.listId === listId && !task.completed).length;
  };

  const handleAddList = () => {
    if (newListName.trim()) {
      if (editingList) {
        updateList(editingList.id, { name: newListName.trim() });
      } else {
        addList({ name: newListName.trim(), icon: 'list-checks' });
      }
      setNewListName('');
      setEditingList(null);
      setIsAddListOpen(false);
    }
  };

  const openEditDialog = (list: List) => {
    setEditingList(list);
    setNewListName(list.name);
    setIsAddListOpen(true);
  };
  
  const handleListClick = (listId: string) => {
    setSelectedListId(listId);
    navigate('/'); // Redirect to main tasks page
  };

  return (
    <aside className="w-60 border-r border-border h-[calc(100vh-4rem)] flex flex-col bg-sidebar">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="mb-6 space-y-1">
          <Link to="/" className="block">
            <Button 
              variant="ghost" 
              className={`w-full justify-start sidebar-item ${location.pathname === '/' && selectedListId === 'inbox' ? 'sidebar-item-active' : ''}`}
              onClick={() => setSelectedListId('inbox')}
            >
              <Inbox className="h-4 w-4" />
              <span className="ml-2">Tasks</span>
            </Button>
          </Link>
          <Link to="/goals" className="block">
            <Button 
              variant="ghost" 
              className={`w-full justify-start sidebar-item ${location.pathname === '/goals' ? 'sidebar-item-active' : ''}`}
            >
              <Goal className="h-4 w-4" />
              <span className="ml-2">Three-Year Goals</span>
            </Button>
          </Link>
          <Link to="/targets" className="block">
            <Button 
              variant="ghost" 
              className={`w-full justify-start sidebar-item ${location.pathname === '/targets' ? 'sidebar-item-active' : ''}`}
            >
              <Target className="h-4 w-4" />
              <span className="ml-2">90-Day Targets</span>
            </Button>
          </Link>
          <Link to="/weekly" className="block">
            <Button 
              variant="ghost" 
              className={`w-full justify-start sidebar-item ${location.pathname === '/weekly' ? 'sidebar-item-active' : ''}`}
            >
              <CalendarCheck className="h-4 w-4" />
              <span className="ml-2">Weekly Goals</span>
            </Button>
          </Link>
        </div>
      
        <nav className="space-y-1">
          {lists.map((list) => (
            <Button
              key={list.id}
              variant="ghost"
              className={`w-full justify-start sidebar-item ${selectedListId === list.id && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
              onClick={() => handleListClick(list.id)}
            >
              {getIconForList(list.icon)}
              <span className="ml-2 flex-1">{list.name}</span>
              {getTaskCountForList(list.id) > 0 && (
                <span className="text-xs bg-secondary rounded-full px-2 py-0.5">
                  {getTaskCountForList(list.id)}
                </span>
              )}
            </Button>
          ))}
        </nav>

        <div className="mt-6">
          <div 
            className="flex items-center px-3 py-2 text-sm font-medium text-sidebar-foreground cursor-pointer"
            onClick={() => setShowCustomLists(!showCustomLists)}
          >
            {showCustomLists ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
            <span>Lists</span>
          </div>

          {showCustomLists && (
            <nav className="mt-1 space-y-1">
              {customLists.map((list) => (
                <div key={list.id} className="group relative">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start sidebar-item ${selectedListId === list.id && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
                    onClick={() => handleListClick(list.id)}
                  >
                    {getIconForList(list.icon)}
                    <span className="ml-2 flex-1">{list.name}</span>
                    {getTaskCountForList(list.id) > 0 && (
                      <span className="text-xs bg-secondary rounded-full px-2 py-0.5">
                        {getTaskCountForList(list.id)}
                      </span>
                    )}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => openEditDialog(list)}>Rename</DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteList(list.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground sidebar-item"
                onClick={() => {
                  setNewListName('');
                  setEditingList(null);
                  setIsAddListOpen(true);
                }}
              >
                <PlusCircle className="h-4 w-4" />
                <span className="ml-2">Add List</span>
              </Button>
            </nav>
          )}
        </div>
      </div>

      <Dialog open={isAddListOpen} onOpenChange={setIsAddListOpen}>
        <DialogContent className="sm:max-w-[425px] animate-scale-in">
          <DialogHeader>
            <DialogTitle>{editingList ? 'Edit List' : 'Add New List'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="list-name" className="text-right">
                Name
              </Label>
              <Input
                id="list-name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddListOpen(false)}>Cancel</Button>
            <Button onClick={handleAddList}>{editingList ? 'Save' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default Sidebar;
