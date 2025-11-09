export type SessionStatus = 'completed' | 'pending';

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  notes?: string;
  day: string; // ISO date string (YYYY-MM-DD)
  status: SessionStatus;
  createdAt: string;
}

export interface WeekData {
  startDate: string;
  endDate: string;
  sessions: StudySession[];
}

// Calendar event type
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: StudySession;
}