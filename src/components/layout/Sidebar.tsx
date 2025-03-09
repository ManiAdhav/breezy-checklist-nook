
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Inbox, Calendar, CalendarClock, ListChecks, PlusCircle, ChevronDown, ChevronRight, MoreHorizontal, User, Briefcase, Target, Goal, CalendarCheck } from 'lucide-react';
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
  const [showGoals, setShowGoals] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState<List | null>(null);

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
    <aside className="w-60 border-r border-border h-[calc(100vh-4rem)] flex flex-col bg-transparent">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="mb-4 space-y-0.5">
          {/* Tasks Section */}
          <div 
            className="flex items-center px-2 py-1.5 text-xs font-medium text-foreground cursor-pointer" 
            onClick={() => setShowTasks(!showTasks)}
          >
            {showTasks ? <ChevronDown className="h-3.5 w-3.5 mr-0.5" /> : <ChevronRight className="h-3.5 w-3.5 mr-0.5" />}
            <span>Tasks</span>
          </div>
          
          {showTasks && (
            <div className="ml-1.5 space-y-0.5">
              <Link to="/" className="block">
                <Button variant="ghost" className={`w-full justify-start h-8 px-2 py-1 text-xs sidebar-item ${location.pathname === '/' && selectedListId === 'inbox' ? 'sidebar-item-active' : ''}`} onClick={() => setSelectedListId('inbox')}>
                  <Inbox className="h-3.5 w-3.5" />
                  <span className="ml-1">Inbox</span>
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button variant="ghost" className={`w-full justify-start h-8 px-2 py-1 text-xs sidebar-item ${selectedListId === 'today' && location.pathname === '/' ? 'sidebar-item-active' : ''}`} onClick={() => setSelectedListId('today')}>
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="ml-1">Today</span>
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button variant="ghost" className={`w-full justify-start h-8 px-2 py-1 text-xs sidebar-item ${selectedListId === 'planned' && location.pathname === '/' ? 'sidebar-item-active' : ''}`} onClick={() => setSelectedListId('planned')}>
                  <CalendarClock className="h-3.5 w-3.5" />
                  <span className="ml-1">Planned</span>
                </Button>
              </Link>
            </div>
          )}
          
          {/* Goals Section */}
          <div 
            className="flex items-center px-2 py-1.5 text-xs font-medium text-foreground cursor-pointer mt-3" 
            onClick={() => setShowGoals(!showGoals)}
          >
            {showGoals ? <ChevronDown className="h-3.5 w-3.5 mr-0.5" /> : <ChevronRight className="h-3.5 w-3.5 mr-0.5" />}
            <span>Goals</span>
          </div>
          
          {showGoals && (
            <div className="ml-1.5 space-y-0.5">
              <Link to="/goals" className="block">
                <Button variant="ghost" className={`w-full justify-start h-8 px-2 py-1 text-xs sidebar-item ${location.pathname === '/goals' ? 'sidebar-item-active' : ''}`}>
                  <Goal className="h-3.5 w-3.5" />
                  <span className="ml-1">Yearly Goals</span>
                </Button>
              </Link>
              <Link to="/targets" className="block">
                <Button variant="ghost" className={`w-full justify-start h-8 px-2 py-1 text-xs sidebar-item ${location.pathname === '/targets' ? 'sidebar-item-active' : ''}`}>
                  <Target className="h-3.5 w-3.5" />
                  <span className="ml-1">90-Day Goals</span>
                </Button>
              </Link>
              <Link to="/weekly" className="block">
                <Button variant="ghost" className={`w-full justify-start h-8 px-2 py-1 text-xs sidebar-item ${location.pathname === '/weekly' ? 'sidebar-item-active' : ''}`}>
                  <CalendarCheck className="h-3.5 w-3.5" />
                  <span className="ml-1">Weekly Goals</span>
                </Button>
              </Link>
            </div>
          )}
          
          <Link to="/calendar" className="block mt-3">
            <Button variant="ghost" className={`w-full justify-start h-8 px-2 py-1 text-xs sidebar-item ${location.pathname === '/calendar' ? 'sidebar-item-active' : ''}`}>
              <Calendar className="h-3.5 w-3.5" />
              <span className="ml-1">Calendar</span>
            </Button>
          </Link>
        </div>
      
        <nav className="space-y-0.5 mt-3">
          {lists.map(list => (
            <Button 
              key={list.id} 
              variant="ghost" 
              className={`w-full justify-start h-8 px-2 py-1 text-xs sidebar-item ${selectedListId === list.id && location.pathname === '/' ? 'sidebar-item-active' : ''}`} 
              onClick={() => handleListClick(list.id)}
            >
              {getIconForList(list.icon)}
              <span className="ml-1 flex-1">{list.name}</span>
              {getTaskCountForList(list.id) > 0 && (
                <span className="text-[10px] bg-secondary rounded-full px-1.5 py-0.5">
                  {getTaskCountForList(list.id)}
                </span>
              )}
            </Button>
          ))}
        </nav>

        <div className="mt-4">
          <div 
            className="flex items-center px-2 py-1.5 text-xs font-medium text-foreground cursor-pointer" 
            onClick={() => setShowCustomLists(!showCustomLists)}
          >
            {showCustomLists ? <ChevronDown className="h-3.5 w-3.5 mr-0.5" /> : <ChevronRight className="h-3.5 w-3.5 mr-0.5" />}
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
                    {getIconForList(list.icon)}
                    <span className="ml-1 flex-1">{list.name}</span>
                    {getTaskCountForList(list.id) > 0 && (
                      <span className="text-[10px] bg-secondary rounded-full px-1.5 py-0.5">
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
                        <MoreHorizontal className="h-3 w-3" />
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
                className="w-full justify-start h-8 px-2 py-1 text-xs text-muted-foreground sidebar-item" 
                onClick={() => {
                  setNewListName('');
                  setEditingList(null);
                  setIsAddListOpen(true);
                }}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="ml-1">Add List</span>
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
    </aside>
  );
};

export default Sidebar;
