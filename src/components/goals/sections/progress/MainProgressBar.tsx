
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface MainProgressBarProps {
  progressPercentage: number;
}

const MainProgressBar: React.FC<MainProgressBarProps> = ({ progressPercentage }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm">Goal Progress</h3>
        <span className="text-sm font-semibold">{progressPercentage}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2.5" />
    </>
  );
};

export default MainProgressBar;
