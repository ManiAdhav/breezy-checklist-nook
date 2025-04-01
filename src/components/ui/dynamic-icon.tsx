
import React from 'react';
import { icons } from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof icons | string;
}

const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  // Handle string that might not be a valid key in icons
  let iconKey = name as keyof typeof icons;
  
  // Check if the icon exists, if not default to List
  if (!icons[iconKey]) {
    iconKey = 'List';
  }
  
  const Icon = icons[iconKey];
  return <Icon {...props} />;
};

export default DynamicIcon;
