
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MailOpen } from 'lucide-react';

const CalendarLink: React.FC = () => {
  return (
    <Link to="/calendar" className="block mt-2">
      <Button variant="ghost" className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${location.pathname === '/calendar' ? 'sidebar-item-active' : ''}`}>
        <MailOpen className="h-4 w-4 mr-2" />
        <span>Calendar</span>
      </Button>
    </Link>
  );
};

export default CalendarLink;
