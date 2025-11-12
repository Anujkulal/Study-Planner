import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { type StudySession } from '../types';
import { Clock, CalendarClock } from 'lucide-react';
import { formatDate, getWeekDates } from '@/lib/dateUtils';
import { Badge } from './ui/badge';
import StatsCard from './StatsCard';
import GlassyProgressBar from './ui/GlassyProgressBar';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import {confetti} from '@tsparticles/confetti';
import { useEffect } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


// Add confetti celebration function
const celebrateCompletion = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

interface ProgressDashboardProps {
  sessions?: StudySession[];
}

export const ProgressDashboard = ({ sessions }: ProgressDashboardProps) => {
  // const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  // const completedMinutes = sessions
  //   .filter(s => s.status === 'completed')
  //   .reduce((sum, s) => sum + s.duration, 0);
  // const completedCount = sessions.filter(s => s.status === 'completed').length;
  // const completionPercentage = sessions.length > 0 
  //   ? Math.round((completedCount / sessions.length) * 100)
  //   : 0;

    // console.log('ProgressDashboard sessions:', sessions);

    // Get current week's date range
    const weekDates = getWeekDates(new Date()); // Current week (Sunday to Saturday)
  const weekStart = formatDate(weekDates[0]);
  const weekEnd = formatDate(weekDates[6]);

  // Filter sessions for current week only
  if(!sessions){
    sessions = [];
  }
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

  // Celebrate when completion reaches 100%
  useEffect(() => {
    if (completionPercentageWeekly === 100 && weekSessions.length > 0) {
      celebrateCompletion();
    }
  }, [completionPercentageWeekly, weekSessions.length]);

  return (
    <motion.div 
    className="space-y-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <StatsCard sessions={sessions} />
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> // REMOVE LATER
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
      </div> */}

        <motion.div 
        className="grid grid-cols-1  gap-4"
        variants={staggerContainer}
      >
        <motion.div >
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
            {/* <span className="font-semibold">{completionPercentageWeekly}%</span> */}
            <motion.span 
                  className="font-semibold"
                  key={completionPercentageWeekly}
                  initial={{ scale: 1.5, color: '#22c55e' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                >
                  {completionPercentageWeekly}%
                </motion.span>
          </div>
          {/* <Progress value={completionPercentageWeekly} className="h-4" /> */}
          {/* <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              > */}
          <GlassyProgressBar progress={completionPercentageWeekly} />
          {/* </motion.div> */}
          <p className="text-xs text-muted-foreground">
            {completedCountWeekly} of {weekSessions.length} sessions completed this week
          </p>
        </CardContent>
      </Card>
      </motion.div>

        <motion.div >
      <Card className='h-[280px]'>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                Upcoming Sessions
              </CardTitle>
              <motion.div
                  key={upcomingSessions.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Badge variant="secondary" className="text-xs">
                    {upcomingSessions.length}
                  </Badge>
                </motion.div>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <motion.div 
                  className="text-center py-6 text-muted-foreground text-sm"
                  variants={fadeInUp}
                >
                  <CalendarClock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No upcoming sessions this week</p>
                </motion.div>
            ) : (
              // <ScrollArea className="h-[120px]">
              //   <motion.div 
              //       className="space-y-2"
              //       variants={staggerContainer}
              //       initial="initial"
              //       animate="animate"
              //     >
              //     {upcomingSessions.map((session) => (
              //       <motion.div
              //           key={session.id}
              //           variants={fadeInUp}
              //           whileHover={{ 
              //             x: 5,
              //             transition: { duration: 0.2 }
              //           }}
              //           className="flex items-center justify-between p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
              //         >
              //         <div className="flex-1 min-w-0">
              //           <p className="font-medium text-sm truncate">{session.subject}</p>
              //           <p className="text-xs text-muted-foreground">
              //             {formatSessionDate(session.day)}
              //           </p>
              //         </div>
              //         <div className="flex items-center gap-2 ml-2">
              //           <div className="flex items-center gap-1 text-xs text-muted-foreground">
              //             <Clock className="h-3 w-3" />
              //             <span>{formatDuration(session.duration)}</span>
              //           </div>
              //         </div>
              //       </motion.div>
              //     ))}
              //   </motion.div>
              // </ScrollArea>
              <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full mt-3"
    >
      <CarouselContent className="-mt-1 h-[140px] w-full">
        {upcomingSessions.map((session) => (
          <CarouselItem key={session.id} className="pt-1 basis-1/3">
            <div className="flex items-center justify-between p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors">
              {/* <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{session.id + 1}</span>
                </CardContent>
              </Card> */}
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
            )}
          </CardContent>
        </Card>
    </motion.div>
    </motion.div>
    </motion.div>
  );
};