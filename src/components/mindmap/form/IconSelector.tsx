
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { icons } from 'lucide-react';

export const iconOptions = [
  { value: 'Target' as keyof typeof icons, label: 'Target' },
  { value: 'Award' as keyof typeof icons, label: 'Award' },
  { value: 'Briefcase' as keyof typeof icons, label: 'Briefcase' },
  { value: 'GraduationCap' as keyof typeof icons, label: 'Education' },
  { value: 'Heart' as keyof typeof icons, label: 'Heart' },
  { value: 'Home' as keyof typeof icons, label: 'Home' },
  { value: 'Plane' as keyof typeof icons, label: 'Travel' },
  { value: 'Smartphone' as keyof typeof icons, label: 'Technology' },
  { value: 'Wallet' as keyof typeof icons, label: 'Finance' },
  { value: 'Smile' as keyof typeof icons, label: 'Lifestyle' },
  { value: 'Users' as keyof typeof icons, label: 'Relationships' },
  { value: 'Utensils' as keyof typeof icons, label: 'Food' },
  { value: 'Dumbbell' as keyof typeof icons, label: 'Fitness' },
  { value: 'BookOpen' as keyof typeof icons, label: 'Knowledge' },
];

export const getRandomIcon = (): keyof typeof icons => {
  const iconsArray = iconOptions.map(opt => opt.value);
  return iconsArray[Math.floor(Math.random() * iconsArray.length)];
};

interface IconSelectorProps {
  selectedIcon: keyof typeof icons;
  onSelectIcon: (iconValue: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelectIcon }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-md"
        >
          <DynamicIcon name={selectedIcon} className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2">
        <div className="grid grid-cols-5 gap-2">
          {iconOptions.map((iconOption) => (
            <Button
              key={iconOption.value}
              variant={selectedIcon === iconOption.value ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => {
                onSelectIcon(iconOption.value);
              }}
              type="button"
            >
              <DynamicIcon name={iconOption.value} className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconSelector;
