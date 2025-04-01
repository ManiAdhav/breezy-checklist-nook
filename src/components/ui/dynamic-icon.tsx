
import React from 'react';
import { icons } from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const iconName = name as keyof typeof icons;
  
  // Check if the icon exists in the Lucide icons collection
  if (!icons[iconName]) {
    // Fallback to a safe default icon to prevent errors
    return React.createElement(icons.List, props);
  }
  
  // Safely render the icon
  return React.createElement(icons[iconName], props);
};

export default DynamicIcon;
