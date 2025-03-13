
import { useState } from 'react';
import { NinetyDayTarget } from '@/types/task';

interface UseMilestoneFiltersProps {
  milestones: NinetyDayTarget[];
}

export const useMilestoneFilters = ({ milestones }: UseMilestoneFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const filteredTargets = milestones.filter(target =>
    target.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    isDatePickerOpen,
    setIsDatePickerOpen,
    filteredTargets
  };
};
