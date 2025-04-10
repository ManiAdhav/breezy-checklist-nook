
import React from 'react';
import DynamicIcon from '@/components/ui/dynamic-icon';

// List of common habit icons to choose from
export const HABIT_ICONS = [
  'Activity', 'AlarmClock', 'Apple', 'Baby', 'Barbell', 'Bath', 'Beef',
  'Beer', 'Book', 'BrainCircuit', 'Briefcase', 'Building', 'Bus', 'Calculator',
  'Calendar', 'Camera', 'Car', 'Carrot', 'ChefHat', 'Cigarette', 'ClipboardList',
  'Clock', 'Cloud', 'Code', 'Coffee', 'Compass', 'CreditCard', 'Drumstick',
  'Dumbbell', 'Egg', 'FileText', 'Film', 'Flame', 'Gamepad2', 'Gift', 'GlassWater',
  'Globe', 'Handshake', 'Heart', 'Home', 'Laptop', 'Leaf', 'Library', 'LightbulbOff',
  'Meditation', 'Milestone', 'Microphone', 'Moon', 'Mountain', 'Bike', 'Music',
  'Newspaper', 'PaintBucket', 'Pencil', 'Pill', 'Plant', 'Running', 'School', 
  'ShoppingBag', 'ShoppingCart', 'Shower', 'Sleep', 'Smartphone', 'Smoking', 
  'SunMedium', 'Target', 'Timer', 'Trophy', 'Utensils', 'Video', 'Wallet', 
  'Water', 'Wine', 'Yoga'
];

interface HabitIconSelectorProps {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  showIconSelector: boolean;
  toggleIconSelector: () => void;
}

const HabitIconSelector: React.FC<HabitIconSelectorProps> = ({
  selectedIcon,
  setSelectedIcon,
  showIconSelector,
  toggleIconSelector
}) => {
  return (
    <>
      <div 
        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
        onClick={toggleIconSelector}
      >
        <DynamicIcon name={selectedIcon} className="h-5 w-5 text-primary" />
      </div>
      
      {showIconSelector && (
        <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
          <div className="grid grid-cols-6 gap-2">
            {HABIT_ICONS.map((icon) => (
              <div
                key={icon}
                className={`p-2 rounded-md cursor-pointer hover:bg-primary/10 flex items-center justify-center ${
                  selectedIcon === icon ? 'bg-primary/20 ring-1 ring-primary' : ''
                }`}
                onClick={() => {
                  setSelectedIcon(icon);
                  toggleIconSelector();
                }}
              >
                <DynamicIcon name={icon} className="h-5 w-5" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HabitIconSelector;
