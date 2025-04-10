
import React from 'react';
import { format } from 'date-fns';
import { HabitLog } from '@/types/habit';
import { Check, X } from 'lucide-react';

interface HabitLogListProps {
  logs: HabitLog[];
  habitUnit: string;
}

const HabitLogList: React.FC<HabitLogListProps> = ({ logs, habitUnit }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        No entries yet. Start logging your progress!
      </div>
    );
  }

  // Group logs by month for better organization
  const groupedLogs: { [key: string]: HabitLog[] } = {};
  
  logs.forEach(log => {
    const monthYear = format(new Date(log.date), 'MMMM yyyy');
    if (!groupedLogs[monthYear]) {
      groupedLogs[monthYear] = [];
    }
    groupedLogs[monthYear].push(log);
  });

  return (
    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
      {Object.entries(groupedLogs).map(([monthYear, monthLogs]) => (
        <div key={monthYear}>
          <h4 className="text-sm font-medium text-gray-500 mb-2">{monthYear}</h4>
          <div className="space-y-2">
            {monthLogs.map(log => (
              <div 
                key={log.id} 
                className="flex items-center justify-between p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  {log.value > 0 ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="text-sm">
                    {format(new Date(log.date), 'EEE, MMM d')}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {log.value} {habitUnit}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitLogList;
