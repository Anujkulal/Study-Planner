export const getWeekDates = (date: Date = new Date()): Date[] => {
  const curr = new Date(date);
  const first = curr.getDate() - curr.getDay(); // Sunday
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(curr);
    day.setDate(first + i);
    weekDates.push(day);
  }
  return weekDates;
};

export const formatDate = (date: Date): string => {
  // console.log('Formatting date:', date);
  // console.log('Formatted date string:', date.toISOString().split('T')[0]);
  return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-IN', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return formatDate(date) === formatDate(today);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDate(date1) === formatDate(date2);
};