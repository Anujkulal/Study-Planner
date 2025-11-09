import { useState } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { type StudySession } from '../types';
import { DayDetailsModal } from './DayDetailsModal';
import { Calendar as CalendarIcon } from 'lucide-react';
import './styles/calendar.css';
import { maxDate, minDate } from '@/constants';

interface WeeklyCalendarProps {
  sessions: StudySession[];
  onAddSession: (day: string) => void;
  onEditSession: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
  loading: boolean;
  onSessionUpdated?: () => void;
}

export const WeeklyCalendar = ({
  sessions,
  onAddSession,
  onEditSession,
  onDeleteSession,
  loading,
  onSessionUpdated,
}: WeeklyCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [month, setMonth] = useState<Date>(new Date());

  const defaultClassNames = getDefaultClassNames();


  // Get all dates that have sessions
  const sessionDates = sessions.map(s => new Date(s.day));

  // Get dates with completed sessions
  const completedDates = sessions
    .filter(s => s.status === 'completed')
    .map(s => new Date(s.day));

  // Get dates with pending sessions
  const pendingDates = sessions
    .filter(s => s.status === 'pending')
    .map(s => new Date(s.day));

  // Custom modifiers for styling
  const modifiers = {
    hasSession: sessionDates,
    completed: completedDates,
    pending: pendingDates,
  };

  const modifiersClassNames = {
    hasSession: 'has-session',
    completed: 'completed-session',
    pending: 'pending-session',
  };

  const handleDayClick = (date: Date | undefined) => {
    if (date) {
      // console.log('Clicked date:', date);
      const now = new Date();
      const dateWithCurrentTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      )
      console.log('Date with current time:', dateWithCurrentTime);
      setSelectedDate(dateWithCurrentTime);
      setDayModalOpen(true);
    }
  };

  // // Get session count for a specific date // TODO: Use this to show count on each date
  // const getSessionCount = (date: Date) => {
  //   const dateStr = formatDate(date);
  //   return sessions.filter(s => s.day === dateStr).length;
  // };

  // // Custom day content to show session count
  // const renderDay = (date: Date) => {
  //   const count = getSessionCount(date);
  //   return (
  //     <div className="relative w-full h-full flex items-center justify-center">
  //       <span>{date.getDate()}</span>
  //       {count > 0 && (
  //         <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
  //           {count}
  //         </span>
  //       )}
  //     </div>
  //   );
  // };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            Loading calendar...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Study Calendar
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Click on any date to view or add study sessions
          </p>
        </CardHeader>
        <CardContent>
          <div className="calendar-wrapper flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              onDayClick={handleDayClick}
              today={new Date()}
              captionLayout="dropdown"
              startMonth={minDate}
              endMonth={maxDate}
              month={month}
              onMonthChange={setMonth}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              showOutsideDays
              className="custom-calendar"
              // components={{
              //   DayContent: ({ date }) => renderDay(date),
              // }}
              classNames={{
        today: `text-primary`, // Add a border to today's date
        selected: `bg-gradient-to-r from-blue-500 to-blue-800 border-primary text-white rounded-full`, // Highlight the selected day
        root: `${defaultClassNames.root}  p-5`, // Add a shadow to the root element
        chevron: `fill-primary`, // Change the color of the chevron
      }}
            />
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-semibold mb-3">Legend</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                  {sessions.filter(s => s.status === 'completed').length}
                </div>
                <span>Completed Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                  {sessions.filter(s => s.status === 'pending').length}
                </div>
                <span>Pending Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                  {sessions.length}
                </div>
                <span>Number of sessions</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DayDetailsModal
        open={dayModalOpen}
        onOpenChange={setDayModalOpen}
        date={selectedDate || null}
        sessions={sessions}
        onAddSession={onAddSession}
        onEditSession={onEditSession}
        onDeleteSession={onDeleteSession}
        onSessionUpdated={onSessionUpdated}
      />
    </>
  );
};