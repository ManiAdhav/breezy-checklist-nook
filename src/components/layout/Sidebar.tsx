
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Inbox, Calendar, CalendarClock, ListChecks, PlusCircle, 
  ChevronDown, ChevronRight, MoreHorizontal, User, Briefcase, 
  Target, Goal, CalendarCheck, Settings, Search, Home 
} from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { List } from '@/types/task';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
    tasks
  } = useTask();
  const [showCustomLists, setShowCustomLists] = useState(true);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState<List | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const getIconForList = (icon: string | undefined) => {
    switch (icon) {
      case 'inbox':
        return <Inbox className="h-4 w-4" />;
      case 'calendar':
        return <Calendar className="h-4 w-4" />;
      case 'calendar-clock':
        return <CalendarClock className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'briefcase':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <ListChecks className="h-4 w-4" />;
    }
  };

  const getTaskCountForList = (listId: string) => {
    return tasks.filter(task => task.listId === listId && !task.completed).length;
  };

  const handleAddList = () => {
    if (newListName.trim()) {
      if (editingList) {
        updateList(editingList.id, {
          name: newListName.trim()
        });
      } else {
        addList({
          name: newListName.trim(),
          icon: 'list-checks'
        });
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
    <div className="flex h-[calc(100vh-4rem)]">
      <aside className="w-72 border-r border-border h-full flex flex-col bg-white">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." className="pl-9 bg-gray-50" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 px-3">
          <h2 className="font-semibold text-lg mb-2">Columbus Workspace</h2>
          
          <div className="space-y-1">
            {lists.map(list => (
              <Button 
                key={list.id} 
                variant="ghost" 
                className={`w-full justify-start text-left h-auto py-2 ${
                  selectedListId === list.id && location.pathname === '/' 
                    ? 'bg-primary text-white hover:bg-primary hover:text-white' 
                    : 'hover:bg-gray-100'
                }`} 
                onClick={() => handleListClick(list.id)}
              >
                <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                  {getIconForList(list.icon)}
                </div>
                <span className="flex-1 truncate">{list.name}</span>
                {getTaskCountForList(list.id) > 0 && (
                  <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                    {getTaskCountForList(list.id)}
                  </span>
                )}
              </Button>
            ))}
          </div>

          <div className="mt-4">
            <div 
              className="flex items-center px-2 py-2 text-sm font-medium cursor-pointer" 
              onClick={() => setShowCustomLists(!showCustomLists)}
            >
              {showCustomLists ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
              <span>Lists</span>
            </div>

            {showCustomLists && (
              <div className="mt-1 space-y-1">
                {customLists.map(list => (
                  <div key={list.id} className="group relative">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start text-left h-auto py-2 ${
                        selectedListId === list.id && location.pathname === '/' 
                          ? 'bg-primary text-white hover:bg-primary hover:text-white' 
                          : 'hover:bg-gray-100'
                      }`} 
                      onClick={() => handleListClick(list.id)}
                    >
                      <div className={`w-5 h-5 mr-3 flex-shrink-0 rounded-full border ${
                        selectedListId === list.id ? 'border-white' : 'border-gray-400'
                      } flex items-center justify-center`}>
                        {getIconForList(list.icon)}
                      </div>
                      <span className="flex-1 truncate">{list.name}</span>
                      {getTaskCountForList(list.id) > 0 && (
                        <span className={`ml-2 text-xs ${
                          selectedListId === list.id ? 'bg-white/20' : 'bg-gray-200'
                        } rounded-full px-2 py-0.5`}>
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
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteList(list.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:bg-gray-100" 
                  onClick={() => {
                    setNewListName('');
                    setEditingList(null);
                    setIsAddListOpen(true);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-3" />
                  <span>Add List</span>
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h2 className="font-semibold mb-1">My Workspaces</h2>
            <div className="space-y-1">
              {['Dribbble Shot', 'Mobile App', 'Landing Page', 'Dashboard'].map((workspace, i) => (
                <Button 
                  key={i} 
                  variant="ghost" 
                  className="w-full justify-start text-left h-auto py-2 hover:bg-gray-100"
                >
                  <div className="w-5 h-5 mr-3 flex-shrink-0 text-gray-500">
                    {i === 0 ? (
                      <div className="w-5 h-5 rounded-full bg-pink-400 text-white flex items-center justify-center text-xs">D</div>
                    ) : (
                      <ListChecks className="h-4 w-4" />
                    )}
                  </div>
                  <span className="truncate">{workspace}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-auto p-3">
          <div className="rounded-lg bg-gray-50 p-3 text-sm text-center">
            <p className="text-gray-500 mb-2">Upgrade your account for more complete features</p>
            <Button className="w-full">Upgrade Now</Button>
          </div>
        </div>
      </aside>

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
                onChange={e => setNewListName(e.target.value)} 
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
    </div>
  );
};

export default Sidebar;
