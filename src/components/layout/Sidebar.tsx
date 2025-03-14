
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '@/contexts/TaskContext';
import { List } from '@/types/task';
import TasksSection from './sidebar/TasksSection';
import CatalystSection from './sidebar/CatalystSection';
import SidebarList from './sidebar/SidebarList';
import AddListDialog from './sidebar/AddListDialog';
import CalendarLink from './sidebar/CalendarLink';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedListId,
    setSelectedListId,
    addList,
    updateList,
    customLists
  } = useTask();
  
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState<List | null>(null);

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

  return (
    <aside className="w-60 border-r border-border h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto py-2 px-2">
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
        />
      </div>

      <AddListDialog 
        isOpen={isAddListOpen}
        onOpenChange={setIsAddListOpen}
        newListName={newListName}
        setNewListName={setNewListName}
        handleAddList={handleAddList}
        editingList={editingList}
      />
    </aside>
  );
};

export default Sidebar;
