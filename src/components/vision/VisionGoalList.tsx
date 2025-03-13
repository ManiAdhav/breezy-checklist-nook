
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeYearGoal } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useMobile } from '@/hooks/use-mobile';
import DynamicIcon from '@/components/ui/dynamic-icon';

interface VisionGoalListProps {
  goals: ThreeYearGoal[];
}

const VisionGoalList: React.FC<VisionGoalListProps> = ({ goals }) => {
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  
  if (goals.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Target className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>No goals mapped to this vision yet</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/goals')}
        >
          Create a goal
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Related Goals</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/goals')}
          className="text-muted-foreground hover:text-foreground flex items-center"
        >
          View all goals
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center">
              {goal.icon ? (
                <DynamicIcon 
                  name={goal.icon as keyof typeof import('lucide-react').icons} 
                  className="h-5 w-5 mr-2 text-primary" 
                />
              ) : (
                <Target className="h-5 w-5 mr-2 text-primary" />
              )}
              <CardTitle className="text-base">{goal.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {goal.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {goal.description}
                </p>
              )}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Due: {format(new Date(goal.endDate), 'MMM d, yyyy')}</span>
                <span className="capitalize">{goal.status.replace('_', ' ')}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3 w-full"
                onClick={() => navigate(`/goals/${goal.id}`)}
              >
                View Goal Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VisionGoalList;
