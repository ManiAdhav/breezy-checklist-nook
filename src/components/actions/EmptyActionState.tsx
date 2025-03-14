
import React from 'react';

const EmptyActionState: React.FC = () => {
  return (
    <div className="text-center py-10 border rounded-lg bg-muted/20">
      <p className="text-muted-foreground">No actions found. Add an action to get started.</p>
    </div>
  );
};

export default EmptyActionState;
