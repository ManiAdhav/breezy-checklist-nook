
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '@/contexts/TaskContext';
import { List } from '@/types/task';
import TasksSection from './sidebar/TasksSection';
import CatalystSection from './sidebar/CatalystSection';
import SidebarList from './sidebar/SidebarList';
import AddListDialog from './sidebar/AddListDialog';
import CalendarLink from './sidebar/CalendarLink';
import { Card } from '@/components/ui/card';
import { useSidebar } from '@/components/ui/sidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const {
    selectedListId,
    setSelectedListId,
    addList,
    updateList,
    customLists
  } = useTask();
  
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('List');
  const [editingList, setEditingList] = useState<List | null>(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isAddListOpen) {
      if (!editingList) {
        setNewListName('');
        setSelectedIcon('List');
      }
    }
  }, [isAddListOpen, editingList]);
  
  // Set the form values when editing a list
  useEffect(() => {
    if (editingList) {
      setNewListName(editingList.name);
      setSelectedIcon(editingList.icon || 'List');
    }
  }, [editingList]);

  const handleAddList = () => {
    if (newListName.trim()) {
      if (editingList) {
        updateList(editingList.id, {
          name: newListName.trim(),
          icon: selectedIcon
        });
        console.log('Updated list with icon:', selectedIcon);
      } else {
        addList({
          name: newListName.trim(),
          icon: selectedIcon
        });
        console.log('Added list with icon:', selectedIcon);
      }
      setNewListName('');
      setSelectedIcon('List');
      setEditingList(null);
      setIsAddListOpen(false);
    }
  };

  const openEditDialog = (list: List) => {
    setEditingList(list);
    setNewListName(list.name);
    setSelectedIcon(list.icon || 'List');
    setIsAddListOpen(true);
  };

  const handleListClick = (listId: string) => {
    setSelectedListId(listId);
    navigate('/');
  };

  // Determine sidebar position based on state
  const sidebarPosition = state === 'expanded' ? 'fixed' : 'fixed -left-[330px]';
  const transitionClass = 'transition-all duration-200 ease-in-out';

  return (
    <>
      <Card className={`${sidebarPosition} ${transitionClass} top-[24px] left-[24px] w-[330px] h-[852px] rounded-[16px] bg-[#f4f4f4] border-none shadow-md z-10 overflow-hidden md:left-[24px]`}>
        <div className="flex justify-end p-2 md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <TasksSection />
            <CatalystSection />
            <CalendarLink />
            <nav className="space-y-0.5 mt-2"></nav>

            <SidebarList 
              openEditDialog={openEditDialog}
              handleListClick={handleListClick}
              selectedListId={selectedListId}
              setIsAddListOpen={setIsAddListOpen}
              setNewListName={setNewListName}
              setEditingList={setEditingList}
              setSelectedIcon={setSelectedIcon}
            />
          </div>
        </div>

        <AddListDialog 
          isOpen={isAddListOpen}
          onOpenChange={setIsAddListOpen}
          newListName={newListName}
          setNewListName={setNewListName}
          handleAddList={handleAddList}
          editingList={editingList}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
      </Card>
    </>
  );
};

export default Sidebar;
