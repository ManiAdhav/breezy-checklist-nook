
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useHabit } from '@/contexts/HabitContext';

const HabitsSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { habits } = useHabit();

  // Count active habits
  const activeHabitsCount = habits ? habits.length : 0;

  return (
    <div className="mb-2 space-y-0.5">
      <div className="flex items-center px-2 py-1 text-xs font-medium text-foreground mt-2">
        <span>Habits</span>
      </div>
      
      <div className="ml-1 space-y-0.5">
        <Button 
          variant="ghost" 
          className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/habits' ? 'sidebar-item-active' : ''}`}
          onClick={() => navigate('/habits')}
        >
          <ListChecks className="h-4 w-4 mr-2" />
          <span>Habits</span>
          {activeHabitsCount > 0 && (
            <span className="text-[9px] bg-secondary rounded-full px-1 py-0.5 min-w-4 text-center ml-auto">
              {activeHabitsCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default HabitsSection;
