
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface ProgressCategoryProps {
  label: string;
  icon: LucideIcon;
  color: string;
  value: number;
  completed: number;
  total: number | string;
  indicatorClassName: string;
}

const ProgressCategory: React.FC<ProgressCategoryProps> = ({
  label,
  icon: Icon,
  color,
  value,
  completed,
  total,
  indicatorClassName
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`flex items-center ${color}`}>
          <Icon className="h-3.5 w-3.5 mr-1.5" />
          {label}
        </span>
        <span>{Math.round(value)}%</span>
      </div>
      <Progress 
        value={value} 
        className="h-1.5"
        indicatorClassName={indicatorClassName}
      />
      <div className="flex items-center mt-1 justify-end">
        <span className="font-medium">{completed}</span>
        <span className="text-muted-foreground ml-1">/ {total}</span>
      </div>
    </div>
  );
};

export default ProgressCategory;
