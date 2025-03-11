
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowLeft, Pencil, Trash2, Target, Calendar, Lightbulb } from 'lucide-react';
import { Vision } from '@/types/task';

interface VisionDetailViewProps {
  vision: Vision;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const VisionDetailView: React.FC<VisionDetailViewProps> = ({ 
  vision, 
  onBack,
  onEdit,
  onDelete
}) => {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Vision Details</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-background border rounded-lg p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{vision.title}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="bg-secondary px-2 py-0.5 rounded-full">
                {vision.areaOfLife}
              </span>
              <span>•</span>
              <Calendar className="h-3.5 w-3.5" />
              <span>Target: {format(new Date(vision.targetDate), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        {vision.description && (
          <div className="mt-4 text-sm text-muted-foreground">
            <h3 className="text-foreground font-medium mb-1">Description</h3>
            <p className="whitespace-pre-wrap">{vision.description}</p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border">
            <span className={`h-2 w-2 rounded-full ${
              vision.status === 'completed' ? 'bg-green-500' : 
              vision.status === 'in_progress' ? 'bg-blue-500' : 
              vision.status === 'abandoned' ? 'bg-red-500' : 
              'bg-gray-500'
            }`}></span>
            <span>{vision.status.replace('_', ' ')}</span>
          </div>
          <span className="text-muted-foreground">
            Created {format(new Date(vision.createdAt), 'MMM d, yyyy')}
          </span>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Related Goals
          </h3>
          <div className="text-center text-sm text-muted-foreground py-6">
            <p className="mb-2">No goals are linked to this vision yet.</p>
            <Button variant="outline" size="sm">
              Create related goal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionDetailView;
