
import React from 'react';

interface ActionHeaderProps {
  title: string;
}

const ActionHeader: React.FC<ActionHeaderProps> = ({ title }) => {
  return (
    <div className="px-4 py-3 bg-muted/50 border-b flex items-center">
      <h3 className="text-sm font-medium">{title}</h3>
    </div>
  );
};

export default ActionHeader;
