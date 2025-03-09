
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Inbox, Mail, Package, MailOpen, Archive, ChevronDown, ChevronRight, MoreHorizontal, User, Briefcase, Target, Mail as MailIcon, Calendar, Clock, CalendarClock } from 'lucide-react';
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
        return <Mail className="h-4 w-4" />;
      case 'calendar-clock':
        return <MailOpen className="h-4 w-4" />;
      case 'user':
        return <Package className="h-4 w-4" />;
      case 'briefcase':
        return <Archive className="h-4 w-4" />;
      default:
        return <Inbox className="h-4 w-4" />;
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
    navigate('/');
  };

  return <aside className="w-60 border-r border-border h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto py-2 px-2">
        <div className="mb-2 space-y-0.5">
          {/* Tasks Section */}
          <div className="flex items-center px-2 py-1 text-xs font-medium text-foreground cursor-pointer mt-2 hover:bg-accent/30 rounded-md" onClick={() => setShowTasks(!showTasks)}>
            {showTasks ? <ChevronDown className="h-3.5 w-3.5 mr-1" /> : <ChevronRight className="h-3.5 w-3.5 mr-1" />}
            <span>Tasks</span>
          </div>
          
          {showTasks && <div className="ml-1 space-y-0.5">
              <Button 
                variant="ghost" 
                className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${selectedListId === 'inbox' && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
                onClick={() => handleListClick('inbox')}
              >
                <Inbox className="h-4 w-4 mr-2" />
                <span>Inbox</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${selectedListId === 'today' && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
                onClick={() => handleListClick('today')}
              >
                <Clock className="h-4 w-4 mr-2" />
                <span>Today</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${selectedListId === 'planned' && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
                onClick={() => handleListClick('planned')}
              >
                <CalendarClock className="h-4 w-4 mr-2" />
                <span>Planned</span>
              </Button>
            </div>}
          
          {/* Goals Section */}
          <div className="flex items-center px-2 py-1 text-xs font-medium text-foreground cursor-pointer mt-2 hover:bg-accent/30 rounded-md" onClick={() => setShowGoals(!showGoals)}>
            {showGoals ? <ChevronDown className="h-3.5 w-3.5 mr-1" /> : <ChevronRight className="h-3.5 w-3.5 mr-1" />}
            <span>Goals</span>
          </div>
          
          {showGoals && <div className="ml-1 space-y-0.5">
              <Link to="/goals" className="block">
                <Button variant="ghost" className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/goals' ? 'sidebar-item-active' : ''}`}>
                  <Target className="h-4 w-4 mr-2" />
                  <span>Goals</span>
                </Button>
              </Link>
              <Link to="/targets" className="block">
                <Button variant="ghost" className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/targets' ? 'sidebar-item-active' : ''}`}>
                  <Archive className="h-4 w-4 mr-2" />
                  <span>Milestone</span>
                </Button>
              </Link>
              <Link to="/weekly" className="block">
                <Button variant="ghost" className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/weekly' ? 'sidebar-item-active font-medium' : ''}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Plan</span>
                </Button>
              </Link>
            </div>}
          
          <Link to="/calendar" className="block mt-2">
            <Button variant="ghost" className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/calendar' ? 'sidebar-item-active' : ''}`}>
              <MailOpen className="h-4 w-4 mr-2" />
              <span>Calendar</span>
            </Button>
          </Link>
        </div>
      
        <nav className="space-y-0.5 mt-2">
          {/* Removed the duplicate list items for Inbox, Today, and Planned as they're now in the Tasks section */}
        </nav>

        <div className="mt-2">
          <div className="flex items-center px-2 py-1 text-xs font-medium text-foreground cursor-pointer hover:bg-accent/30 rounded-md" onClick={() => setShowCustomLists(!showCustomLists)}>
            {showCustomLists ? <ChevronDown className="h-3.5 w-3.5 mr-1" /> : <ChevronRight className="h-3.5 w-3.5 mr-1" />}
            <span>Lists</span>
          </div>

          {showCustomLists && <nav className="mt-0.5 space-y-0.5">
              {customLists.map(list => <div key={list.id} className="group relative">
                  <Button variant="ghost" className={`w-full justify-start h-8 px-2 py-1 text-xs sidebar-item ${selectedListId === list.id && location.pathname === '/' ? 'sidebar-item-active' : ''}`} onClick={() => handleListClick(list.id)}>
                    <div className="flex items-center gap-2 flex-1">
                      {getIconForList(list.icon)}
                      <span className="mr-auto">{list.name}</span>
                    </div>
                    {getTaskCountForList(list.id) > 0 && <span className="text-[9px] bg-secondary rounded-full px-1 py-0.5 min-w-4 text-center ml-1">
                        {getTaskCountForList(list.id)}
                      </span>}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                </div>)}

              <Button variant="ghost" className="w-full justify-start h-8 px-2 py-1 text-xs sidebar-item hover:bg-accent/50" onClick={() => {
            setNewListName('');
            setEditingList(null);
            setIsAddListOpen(true);
          }}>
                <Package className="h-4 w-4 mr-2" />
                <span>Add List</span>
              </Button>
            </nav>}
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
              <Input id="list-name" value={newListName} onChange={e => setNewListName(e.target.value)} className="col-span-3" autoFocus />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddListOpen(false)}>Cancel</Button>
            <Button onClick={handleAddList}>{editingList ? 'Save' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>;
};

export default Sidebar;
