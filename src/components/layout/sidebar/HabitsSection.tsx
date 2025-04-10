
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivitySquare } from 'lucide-react';
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const HabitsSection = () => {
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Habits</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate('/habits')}
              tooltip="Habit Tracker"
            >
              <ActivitySquare className="h-4 w-4" />
              <span>Habit Tracker</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default HabitsSection;
