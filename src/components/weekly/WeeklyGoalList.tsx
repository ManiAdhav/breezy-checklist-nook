
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const WeeklyGoalList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center py-10 border border-dashed rounded-lg border-gray-300">
        <p className="text-muted-foreground mb-4">
          The Weekly Plans feature has been removed.
        </p>
        <Button onClick={() => navigate('/actions')}>
          Go to Actions
        </Button>
      </div>
    </div>
  );
};

export default WeeklyGoalList;
