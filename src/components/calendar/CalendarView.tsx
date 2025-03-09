
import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TaskForm from '@/components/tasks/TaskForm';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { tasks } = useTask();

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getCalendarDates = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = [];
    let day = startDate;

    while (day <= endDate) {
      calendarDays.push(day);
      day = addDays(day, 1);
    }

    return calendarDays;
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = useMemo(() => getCalendarDates(), [currentDate]);

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      // Ensure task.dueDate is a Date object
      const taskDueDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
      return isSameDay(taskDueDate, date);
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsTaskFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Calendar View</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium px-2">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 text-center py-2 border-b">
          {daysOfWeek.map(day => (
            <div key={day} className="text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 h-full">
          {calendarDays.map((day, index) => {
            const tasksForDay = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={index} 
                className={cn(
                  "min-h-[100px] border p-1 relative",
                  !isCurrentMonth && "bg-gray-50 text-gray-400",
                  isToday && "bg-blue-50"
                )}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                    isToday && "bg-primary text-white font-medium",
                    !isToday && isCurrentMonth && "text-gray-700",
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                  {tasksForDay.map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "text-xs p-1 rounded mb-1 truncate",
                        task.completed ? "line-through text-gray-400 bg-gray-100" : "bg-blue-100 text-blue-800"
                      )}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <TaskForm 
          isOpen={isTaskFormOpen} 
          onClose={() => setIsTaskFormOpen(false)} 
          defaultDueDate={selectedDate}
          editingTask={null}
        />
      )}
    </div>
  );
};

export default CalendarView;
