
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Target, Compass, Brain, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const CatalystSection = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full px-2 py-1.5 h-auto text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <span>Nunil</span>
          <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pt-1">
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start pl-6 ${isActive('/goals') ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground'} hover:bg-primary/10 hover:text-primary`}
          onClick={() => navigate('/goals')}
        >
          <Target className="h-4 w-4 mr-2" />
          Goals
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start pl-6 ${isActive('/vision') ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground'} hover:bg-primary/10 hover:text-primary`}
          onClick={() => navigate('/vision')}
        >
          <Compass className="h-4 w-4 mr-2" />
          Vision
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start pl-6 ${isActive('/mindmap') ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground'} hover:bg-primary/10 hover:text-primary`}
          onClick={() => navigate('/mindmap')}
        >
          <Brain className="h-4 w-4 mr-2" />
          Mind Map
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start pl-6 ${isActive('/weekly') ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground'} hover:bg-primary/10 hover:text-primary`}
          onClick={() => navigate('/weekly')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Weekly
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CatalystSection;
