
import React from 'react';
import { LucideIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  iconColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  icon: Icon, 
  title, 
  isOpen, 
  onToggle,
  iconColor = "text-primary" 
}) => {
  return (
    <CollapsibleTrigger 
      className="flex w-full items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors group"
      onClick={onToggle}
    >
      <div className="flex items-center">
        <Icon className={`h-5 w-5 mr-2 ${iconColor}`} />
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="h-6 w-6 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-muted transition-colors">
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </CollapsibleTrigger>
  );
};

export default SectionHeader;
