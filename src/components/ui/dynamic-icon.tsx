
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const Icon = (LucideIcons as Record<string, React.ComponentType<LucideProps>>)[name];
  
  if (!Icon) {
    // Fallback to a default icon if the specified one doesn't exist
    return <LucideIcons.Target {...props} />;
  }
  
  return <Icon {...props} />;
};

export default DynamicIcon;
