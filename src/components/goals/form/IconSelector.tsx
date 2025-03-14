
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from "@/lib/utils";
import { Target, Flag, Flame, Gift, Heart, Key, Layers, Lightbulb, Package, Rocket, Star } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const iconOptions = [
  { value: 'Target', icon: Target },
  { value: 'Flag', icon: Flag },
  { value: 'Flame', icon: Flame },
  { value: 'Gift', icon: Gift },
  { value: 'Heart', icon: Heart },
  { value: 'Key', icon: Key },
  { value: 'Layers', icon: Layers },
  { value: 'Lightbulb', icon: Lightbulb },
  { value: 'Package', icon: Package },
  { value: 'Rocket', icon: Rocket },
  { value: 'Star', icon: Star },
];

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconValue: string) => void;
}

export const getIconComponent = (iconName: string): LucideIcon => {
  return iconOptions.find(i => i.value === iconName)?.icon || Target;
};

export const getRandomIcon = (): string => {
  const randomIndex = Math.floor(Math.random() * iconOptions.length);
  return iconOptions[randomIndex].value;
};

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelectIcon }) => {
  const [iconPopoverOpen, setIconPopoverOpen] = React.useState(false);
  const IconComponent = getIconComponent(selectedIcon);
  
  const handleIconSelect = (iconValue: string) => {
    onSelectIcon(iconValue);
    setIconPopoverOpen(false);
  };
  
  return (
    <Popover open={iconPopoverOpen} onOpenChange={setIconPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          className="flex-shrink-0"
          aria-label="Change icon"
        >
          <IconComponent className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="grid grid-cols-4 gap-2">
          {iconOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                type="button"
                variant={selectedIcon === option.value ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-10 w-10",
                  selectedIcon === option.value && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleIconSelect(option.value)}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{option.value}</span>
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconSelector;
