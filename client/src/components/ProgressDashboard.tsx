import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { type StudySession } from '../types';
import { Clock, CheckCircle2, Target, TrendingUp, CalendarClock } from 'lucide-react';
import { Progress } from './ui/progress';
import { formatDate, getWeekDates } from '@/lib/dateUtils';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface ProgressDashboardProps {
  sessions: StudySession[];
}

export const ProgressDashboard = ({ sessions }: ProgressDashboardProps) => { // TODO: add chart visualization
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const completedMinutes = sessions
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.duration, 0);
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const completionPercentage = sessions.length > 0 
    ? Math.round((completedCount / sessions.length) * 100)
    : 0;

    // console.log('ProgressDashboard sessions:', sessions);

    // Get current week's date range
    const weekDates = getWeekDates(new Date()); // Current week (Sunday to Saturday)
  const weekStart = formatDate(weekDates[0]);
  const weekEnd = formatDate(weekDates[6]);

  // Filter sessions for current week only
  const weekSessions = sessions.filter(s => {
    return s.day >= weekStart && s.day <= weekEnd;
  });

  // console.log('Week sessions:', weekSessions.length); 

  // const totalMinutesWeekly = weekSessions.reduce((sum, s) => sum + s.duration, 0);
  // const completedMinutesWeekly = weekSessions
  //   .filter(s => s.status === 'completed')
  //   .reduce((sum, s) => sum + s.duration, 0);

  const completedCountWeekly = weekSessions.filter(s => s.status === 'completed').length;
  const completionPercentageWeekly = weekSessions.length > 0 
    ? Math.round((completedCountWeekly / weekSessions.length) * 100)
    : 0;

  // Get upcoming sessions (pending sessions in current week, sorted by date)
  const today = formatDate(new Date());
  const upcomingSessions = weekSessions
    .filter(s => s.status === 'pending' && s.day >= today)
    .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

  const formatHours = (minutes: number) => {
    const hours = (minutes / 60).toFixed(1);
    return `${hours}h`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const formatSessionDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (formatDate(date) === formatDate(today)) {
      return 'Today';
    } else if (formatDate(date) === formatDate(tomorrow)) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const stats = [
    {
      title: 'Total Study Hours',
      value: formatHours(totalMinutes),
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Completed Hours',
      value: formatHours(completedMinutes),
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
    {
      title: 'Sessions Completed',
      value: `${completedCount}/${sessions.length}`,
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-950',
    },
    {
      title: 'Completion Rate',
      value: `${completionPercentage}%`,
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-950',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Progress</CardTitle>
          <span className="text-xs text-muted-foreground">
              {weekDates[0].toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </span>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Completion</span>
            <span className="font-semibold">{completionPercentageWeekly}%</span>
          </div>
          <Progress value={completionPercentageWeekly} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedCountWeekly} of {weekSessions.length} sessions completed this week
          </p>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                Upcoming Sessions
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {upcomingSessions.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <CalendarClock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No upcoming sessions this week</p>
              </div>
            ) : (
              <ScrollArea className="h-[120px]">
                <div className="space-y-2">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{session.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatSessionDate(session.day)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(session.duration)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
    </div>
  );
};