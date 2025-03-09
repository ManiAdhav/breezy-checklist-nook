
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Inbox, Calendar, CalendarClock, ListChecks, PlusCircle, 
  ChevronDown, ChevronRight, MoreHorizontal, User, Briefcase,
  Target, Goal, CalendarCheck, Menu, ChevronLeft
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
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  const [isCollapsed, setIsCollapsed] = useState(false);
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
    <aside 
      className={cn(
        "h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 shadow-md",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 bg-white">
        <TooltipProvider delayDuration={300}>
          <div className="flex flex-col items-center space-y-4">
            {/* Main navigation */}
            <div className="w-full px-2">
              <Link to="/" className="block">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-center sidebar-item text-gray-600 hover:bg-gray-100",
                        location.pathname === '/' && selectedListId === 'inbox' ? 'bg-gray-100 text-primary font-medium' : '',
                        !isCollapsed && "justify-start"
                      )}
                      onClick={() => setSelectedListId('inbox')}
                    >
                      <Inbox className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-2">Tasks</span>}
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">Tasks</TooltipContent>}
                </Tooltip>
              </Link>
              <Link to="/goals" className="block mt-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-center sidebar-item text-gray-600 hover:bg-gray-100",
                        location.pathname === '/goals' ? 'bg-gray-100 text-primary font-medium' : '',
                        !isCollapsed && "justify-start"
                      )}
                    >
                      <Goal className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-2">Goals</span>}
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">Three-Year Goals</TooltipContent>}
                </Tooltip>
              </Link>
              <Link to="/targets" className="block mt-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-center sidebar-item text-gray-600 hover:bg-gray-100",
                        location.pathname === '/targets' ? 'bg-gray-100 text-primary font-medium' : '',
                        !isCollapsed && "justify-start"
                      )}
                    >
                      <Target className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-2">Targets</span>}
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">90-Day Targets</TooltipContent>}
                </Tooltip>
              </Link>
              <Link to="/weekly" className="block mt-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-center sidebar-item text-gray-600 hover:bg-gray-100",
                        location.pathname === '/weekly' ? 'bg-gray-100 text-primary font-medium' : '',
                        !isCollapsed && "justify-start"
                      )}
                    >
                      <CalendarCheck className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-2">Weekly</span>}
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">Weekly Goals</TooltipContent>}
                </Tooltip>
              </Link>
            </div>

            {/* Lists section */}
            <div className="w-full px-2">
              {!isCollapsed && (
                <div 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => setShowCustomLists(!showCustomLists)}
                >
                  {showCustomLists ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                  <span>Lists</span>
                </div>
              )}

              {(showCustomLists || isCollapsed) && (
                <div className="mt-1 space-y-1 px-2">
                  {/* Default lists */}
                  {lists.map((list) => (
                    <Tooltip key={list.id}>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-center text-gray-600 hover:bg-gray-100 rounded-md",
                              selectedListId === list.id && location.pathname === '/' ? 'bg-gray-100 text-primary font-medium' : '',
                              !isCollapsed && "justify-start"
                            )}
                            onClick={() => handleListClick(list.id)}
                          >
                            {getIconForList(list.icon)}
                            {!isCollapsed && <span className="ml-2 flex-1">{list.name}</span>}
                            {!isCollapsed && getTaskCountForList(list.id) > 0 && (
                              <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-700">
                                {getTaskCountForList(list.id)}
                              </span>
                            )}
                            {isCollapsed && getTaskCountForList(list.id) > 0 && (
                              <span className="absolute top-0 right-0 text-xs bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                {getTaskCountForList(list.id)}
                              </span>
                            )}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {isCollapsed && <TooltipContent side="right">{list.name}</TooltipContent>}
                    </Tooltip>
                  ))}

                  {/* Custom lists */}
                  {customLists.map((list) => (
                    <Tooltip key={list.id}>
                      <TooltipTrigger asChild>
                        <div className="group relative">
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-center text-gray-600 hover:bg-gray-100 rounded-md",
                              selectedListId === list.id && location.pathname === '/' ? 'bg-gray-100 text-primary font-medium' : '',
                              !isCollapsed && "justify-start"
                            )}
                            onClick={() => handleListClick(list.id)}
                          >
                            {getIconForList(list.icon)}
                            {!isCollapsed && <span className="ml-2 flex-1">{list.name}</span>}
                            {!isCollapsed && getTaskCountForList(list.id) > 0 && (
                              <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-700">
                                {getTaskCountForList(list.id)}
                              </span>
                            )}
                            {isCollapsed && getTaskCountForList(list.id) > 0 && (
                              <span className="absolute top-0 right-0 text-xs bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                {getTaskCountForList(list.id)}
                              </span>
                            )}
                          </Button>
                          
                          {!isCollapsed && (
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
                          )}
                        </div>
                      </TooltipTrigger>
                      {isCollapsed && <TooltipContent side="right">{list.name}</TooltipContent>}
                    </Tooltip>
                  ))}

                  {!isCollapsed && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-500 hover:bg-gray-100"
                      onClick={() => {
                        setNewListName('');
                        setEditingList(null);
                        setIsAddListOpen(true);
                      }}
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span className="ml-2">Add List</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </TooltipProvider>
      </div>

      {/* Collapse/Expand button */}
      <div className="flex justify-center p-2 border-t bg-white">
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full h-8 w-8 hover:bg-gray-100 text-gray-500"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
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
