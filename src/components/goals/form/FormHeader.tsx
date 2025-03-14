
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FormHeaderProps {
  title: string;
  icon: LucideIcon;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, icon: Icon }) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-primary" />
        <span>{title}</span>
      </DialogTitle>
    </DialogHeader>
  );
};

export default FormHeader;
