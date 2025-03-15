
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, CalendarCheck } from 'lucide-react';

const CalendarLink: React.FC = () => {
  const location = useLocation();
  
  return (
    <>
      <Link to="/calendar" className="block mt-2">
        <Button 
          variant="ghost" 
          className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/calendar' ? 'sidebar-item-active' : ''}`}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>Calendar</span>
        </Button>
      </Link>
      
      <Link to="/weekly" className="block mt-1">
        <Button 
          variant="ghost" 
          className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/weekly' ? 'sidebar-item-active' : ''}`}
        >
          <CalendarCheck className="h-4 w-4 mr-2" />
          <span>Weekly Planner</span>
        </Button>
      </Link>
    </>
  );
};

export default CalendarLink;
