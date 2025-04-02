
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/drawer';
import { useSidebar } from '@/components/ui/sidebar';
import TasksSection from './sidebar/TasksSection';
import CatalystSection from './sidebar/CatalystSection';
import SidebarList from './sidebar/SidebarList';
import CalendarLink from './sidebar/CalendarLink';
import { useTask } from '@/contexts/TaskContext';

const MobileSidebar = () => {
  const { toggleSidebar } = useSidebar();
  const {
    selectedListId,
    setSelectedListId,
    customLists
  } = useTask();

  const handleListClick = (listId: string) => {
    setSelectedListId(listId);
  };

  const openEditDialog = () => {
    // This is just a placeholder for mobile view
    // Actual implementation would be handled in SidebarList
  };

  return (
    <div className="md:hidden fixed top-4 left-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="rounded-full bg-white shadow-md"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </div>
  );
};

export default MobileSidebar;
