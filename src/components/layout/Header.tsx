
import React, { useState } from 'react';
import { Search, Bell, Settings, User, PlusCircle } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

const Header: React.FC = () => {
  const { setSearchQuery, searchQuery } = useTask();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="h-16 border-b border-border flex items-center px-6 bg-background/95 backdrop-blur-sm sticky top-0 z-10 justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-medium tracking-tight mr-8">
          TodoApp
        </h1>
        
        <div 
          className={`flex items-center rounded-full transition-all duration-200 ease-in-out ${
            isSearchFocused 
              ? 'bg-white border-primary/20 border shadow-sm w-80' 
              : 'bg-secondary/70 border-transparent w-56'
          }`}
        >
          <Search className="h-4 w-4 ml-3 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            className="border-0 bg-transparent h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-9 w-9 transition-all hover:bg-secondary"
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-9 w-9 transition-all hover:bg-secondary"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-9 w-9 transition-all hover:bg-secondary"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-9 w-9 transition-all hover:bg-secondary overflow-hidden ml-1"
            >
              <User className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-60 animate-scale-in p-0 rounded-xl overflow-hidden shadow-medium" 
            align="end"
          >
            <div className="bg-primary/5 p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center text-sm font-medium">
                  U
                </div>
                <div>
                  <p className="text-sm font-medium">User</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <Button variant="outline" size="sm" className="w-full">
                Log out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
