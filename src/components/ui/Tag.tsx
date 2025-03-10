
import React from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  text: string;
  color?: string;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ text, color, className }) => {
  return (
    <span 
      className={cn(
        "inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full",
        className
      )}
      style={{ 
        backgroundColor: color ? `${color}20` : undefined, // 20 is hex for 12% opacity
        color: color
      }}
    >
      {text}
    </span>
  );
};

export default Tag;
