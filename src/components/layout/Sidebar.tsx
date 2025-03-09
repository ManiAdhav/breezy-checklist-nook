
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Inbox, ListChecks, Calendar, CalendarClock, Target, 
  ChevronDown, ChevronRight, Plus, Settings, 
  MoreHorizontal, PanelLeft, PanelRight, CalendarRange
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMobile } from '@/hooks/use-mobile';

// Allow the icons to be used in various places
export const sidebarIcons = {
  inbox: <Inbox className="h-5 w-5" />,
  calendar: <Calendar className="h-5 w-5" />,
  'calendar-clock': <CalendarClock className="h-5 w-5" />,
  'calendar-range': <CalendarRange className="h-5 w-5" />,
  'list-checks': <ListChecks className="h-5 w-5" />,
  target: <Target className="h-5 w-5" />,
};

const Sidebar = () => {
  const location = useLocation();
  const { customLists, lists, selectedListId, setSelectedListId } = useTask();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCustomListsOpen, setIsCustomListsOpen] = useState(true);
  const { isMobile, mobileMenuOpen, setMobileMenuOpen } = useMobile();
  
  // If on mobile and menu not explicitly opened, don't render the sidebar content
  if (isMobile && !mobileMenuOpen) {
    return null;
  }
  
  const handleListClick = (id: string) => {
    setSelectedListId(id);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };
  
  const pathToPageMapping: Record<string, string> = {
    '/': 'tasks',
    '/goals': 'goals',
    '/targets': 'targets',
    '/weekly': 'weekly',
    '/calendar': 'calendar'
  };
  
  const currentPage = pathToPageMapping[location.pathname] || 'tasks';
  
  return (
    <aside 
      className={cn(
        "bg-white border-r border-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-[260px]",
        isMobile && "absolute inset-y-0 left-0 z-20 shadow-xl"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 h-16 border-b border-border">
          {!isCollapsed && (
            <h1 className="text-lg font-bold">Taskify</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("ml-auto", isCollapsed && "mx-auto")}
          >
            {isCollapsed ? (
              <PanelRight className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {/* Views section */}
            <div className="mb-6">
              {!isCollapsed && (
                <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-3">
                  VIEWS
                </h2>
              )}
              <ul className="space-y-1">
                <SidebarItem
                  to="/"
                  icon={<Inbox className="h-5 w-5" />}
                  text="Tasks"
                  isActive={currentPage === 'tasks'}
                  isCollapsed={isCollapsed}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                />
                <SidebarItem
                  to="/calendar"
                  icon={<CalendarRange className="h-5 w-5" />}
                  text="Calendar"
                  isActive={currentPage === 'calendar'}
                  isCollapsed={isCollapsed}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                />
              </ul>
            </div>
            
            {/* Goals section */}
            <div className="mb-6">
              {!isCollapsed && (
                <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-3">
                  GOALS
                </h2>
              )}
              <ul className="space-y-1">
                <SidebarItem
                  to="/goals"
                  icon={<Calendar className="h-5 w-5" />}
                  text="3-Year Goals"
                  isActive={currentPage === 'goals'}
                  isCollapsed={isCollapsed}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                />
                <SidebarItem
                  to="/targets"
                  icon={<Target className="h-5 w-5" />}
                  text="90-Day Targets"
                  isActive={currentPage === 'targets'}
                  isCollapsed={isCollapsed}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                />
                <SidebarItem
                  to="/weekly"
                  icon={<CalendarClock className="h-5 w-5" />}
                  text="Weekly Goals"
                  isActive={currentPage === 'weekly'}
                  isCollapsed={isCollapsed}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                />
              </ul>
            </div>
            
            {/* Lists section */}
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                {!isCollapsed && (
                  <h2 className="text-xs font-semibold text-muted-foreground">
                    LISTS
                  </h2>
                )}
                {!isCollapsed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => setIsCustomListsOpen(!isCustomListsOpen)}
                  >
                    {isCustomListsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              
              {(isCustomListsOpen || isCollapsed) && (
                <ul className="space-y-1">
                  {/* Default lists */}
                  {lists.map((list) => (
                    <li key={list.id}>
                      <button
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                          selectedListId === list.id && currentPage === 'tasks'
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => handleListClick(list.id)}
                      >
                        {list.icon && sidebarIcons[list.icon as keyof typeof sidebarIcons]}
                        {!isCollapsed && <span className="ml-3">{list.name}</span>}
                      </button>
                    </li>
                  ))}
                  
                  {/* Custom lists */}
                  {customLists.map((list) => (
                    <li key={list.id}>
                      <button
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors group",
                          selectedListId === list.id && currentPage === 'tasks'
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => handleListClick(list.id)}
                      >
                        <ListChecks className="h-5 w-5" />
                        {!isCollapsed && (
                          <>
                            <span className="ml-3 flex-1 truncate">{list.name}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 opacity-0 group-hover:opacity-100"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  Edit List
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  Delete List
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </button>
                    </li>
                  ))}
                  
                  {/* Add list button */}
                  <li>
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-3">Add List</span>}
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </nav>
        </div>
        
        <div className="border-t border-border p-4">
          <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  to, icon, text, isActive, isCollapsed, onClick 
}) => {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-gray-700 hover:bg-gray-100"
        )}
        onClick={onClick}
      >
        {icon}
        {!isCollapsed && <span className="ml-3">{text}</span>}
      </Link>
    </li>
  );
};

export default Sidebar;
