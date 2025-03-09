
import { addDays, addWeeks, nextMonday, nextTuesday, nextWednesday, nextThursday, nextFriday, nextSaturday, nextSunday, parse, format, isValid } from 'date-fns';

interface ParsedDate {
  date: Date | null;
  recurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface ParsedTask {
  title: string;
  dueDate: Date | null;
  recurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export const parseNaturalLanguageDate = (text: string): ParsedDate => {
  const lowerText = text.toLowerCase();
  const today = new Date();
  let date: Date | null = null;
  let recurring = false;
  let recurringPattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined;
  
  // Check for recurring patterns
  if (lowerText.includes('every day') || lowerText.includes('daily')) {
    recurring = true;
    recurringPattern = 'daily';
    date = today;
  } else if (lowerText.includes('every week') || lowerText.includes('weekly')) {
    recurring = true;
    recurringPattern = 'weekly';
    date = today;
  } else if (lowerText.includes('every month') || lowerText.includes('monthly')) {
    recurring = true;
    recurringPattern = 'monthly';
    date = today;
  } else if (lowerText.includes('every year') || lowerText.includes('yearly')) {
    recurring = true;
    recurringPattern = 'yearly';
    date = today;
  }
  
  // Check for specific days
  else if (lowerText.includes('today')) {
    date = today;
  } else if (lowerText.includes('tomorrow')) {
    date = addDays(today, 1);
  } else if (lowerText.includes('next week')) {
    date = addWeeks(today, 1);
  } else if (lowerText.match(/next\s+monday/)) {
    date = nextMonday(today);
  } else if (lowerText.match(/next\s+tuesday/)) {
    date = nextTuesday(today);
  } else if (lowerText.match(/next\s+wednesday/)) {
    date = nextWednesday(today);
  } else if (lowerText.match(/next\s+thursday/)) {
    date = nextThursday(today);
  } else if (lowerText.match(/next\s+friday/)) {
    date = nextFriday(today);
  } else if (lowerText.match(/next\s+saturday/)) {
    date = nextSaturday(today);
  } else if (lowerText.match(/next\s+sunday/)) {
    date = nextSunday(today);
  }
  
  // Try to find dates in format "on March 15" or "March 15"
  const dateRegex = /(?:on\s+)?([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?/i;
  const dateMatch = lowerText.match(dateRegex);
  if (dateMatch) {
    const monthName = dateMatch[1];
    const day = parseInt(dateMatch[2], 10);
    const currentYear = today.getFullYear();
    
    // Try to parse the date
    const dateString = `${monthName} ${day}, ${currentYear}`;
    const parsedDate = parse(dateString, 'MMMM d, yyyy', new Date());
    
    if (isValid(parsedDate)) {
      // If the date has already passed this year, use next year
      if (parsedDate < today) {
        parsedDate.setFullYear(currentYear + 1);
      }
      date = parsedDate;
    }
  }
  
  // Check for time in the format "at X PM/AM" or "X PM/AM"
  const timeRegex = /(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i;
  const timeMatch = lowerText.match(timeRegex);
  
  if (timeMatch && date) {
    const hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const period = timeMatch[3].toLowerCase();
    
    let hour24 = hours;
    if (period === 'pm' && hours < 12) {
      hour24 = hours + 12;
    } else if (period === 'am' && hours === 12) {
      hour24 = 0;
    }
    
    date.setHours(hour24);
    date.setMinutes(minutes);
  }
  
  return { date, recurring, recurringPattern };
};

export const parseNaturalLanguageTask = (text: string): ParsedTask => {
  // Parse the date from the text
  const dateInfo = parseNaturalLanguageDate(text);
  
  // Remove date-related phrases to get the task title
  let title = text
    .replace(/(?:on|at|next|every|daily|weekly|monthly|yearly)\s+\w+(?:\s+\d{1,2}(?:st|nd|rd|th)?)?(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm))?/i, '')
    .replace(/\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)/i, '')
    .replace(/tomorrow/i, '')
    .replace(/today/i, '')
    .replace(/next\s+week/i, '')
    .trim();
  
  return {
    title,
    dueDate: dateInfo.date,
    recurring: dateInfo.recurring,
    recurringPattern: dateInfo.recurringPattern
  };
};
