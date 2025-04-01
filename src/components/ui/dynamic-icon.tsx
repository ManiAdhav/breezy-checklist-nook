
import React from 'react';
import { icons } from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof icons;
}

const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const Icon = icons[name];
  
  if (!Icon) {
    return React.createElement(icons.List, props);
  }
  
  return <Icon {...props} />;
};

export default DynamicIcon;
