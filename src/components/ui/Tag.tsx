
import React from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  text: string;
  color?: string;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ text, color = '#8B5CF6', className }) => {
  // Create a lighter version of the color for the background (20% opacity)
  const bgColor = `${color}20`;
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        className
      )}
      style={{ 
        backgroundColor: bgColor,
        color: color,
        borderColor: `${color}40`, // 40% opacity border
      }}
    >
      {text}
    </span>
  );
};

export default Tag;
