
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import TasksSection from './sidebar/TasksSection';
import CatalystSection from './sidebar/CatalystSection';
import SidebarList from './sidebar/SidebarList';
import CalendarLink from './sidebar/CalendarLink';
import { useTask } from '@/contexts/TaskContext';

const MobileSidebar = () => {
  const {
    selectedListId,
    setSelectedListId,
    customLists
  } = useTask();

  const handleListClick = (listId: string) => {
    setSelectedListId(listId);
  };

  return (
    <div className="md:hidden fixed top-4 left-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white shadow-md border border-gray-200"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[300px]">
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <TasksSection />
              <CatalystSection />
              <CalendarLink />
              <nav className="space-y-0.5 mt-2"></nav>

              <SidebarList 
                openEditDialog={() => {}}
                handleListClick={handleListClick}
                selectedListId={selectedListId}
                setIsAddListOpen={() => {}}
                setNewListName={() => {}}
                setEditingList={() => {}}
                setSelectedIcon={() => {}}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebar;
