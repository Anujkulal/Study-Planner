import { Check, ClockIcon, Target, TrendingUp } from "lucide-react";
import type { StudySession } from "@/types";

interface StatsRingProps {
  percentage: number;
  color?: string;
}

const StatsRing = ({ percentage, color }: StatsRingProps) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // console.log('StatsRing percentage:', percentage, 'offset:', offset);

  return (
    <svg className="w-14 h-14 transform -rotate-90">
      <circle
        cx="28"
        cy="28"
        r={radius}
        stroke={percentage !== 0 ? "#333333" : "#ef4444"}
        strokeWidth="6"
        fill="none"
      />
      <circle
        cx="28"
        cy="28"
        r={radius}
        stroke={color}
        strokeWidth="6"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
};

interface StatsCardProps {
  sessions: StudySession[];
}

const StatsCard = ({ sessions }: StatsCardProps) => {
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    // console.log('Total minutes:', totalMinutes);
  const completedMinutes = sessions
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.duration, 0);
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const completionPercentage = sessions.length > 0 
    ? Math.round((completedCount / sessions.length) * 100)
    : 0;

    const formatHours = (minutes: number) => {
    const hours = (minutes / 60).toFixed(1);
    return `${hours}h`;
  };

    const stats = [
  { id: 1, title: "Total Study Hours", value: formatHours(totalMinutes), result: (totalMinutes/totalMinutes) * 100 , icon: <ClockIcon size={26} /> },
  { id: 2, title: "Completed Hours", value: formatHours(completedMinutes), result: (completedMinutes/totalMinutes) * 100, icon: <Check size={26} /> },
  { id: 3, title: "Sessions Completed", value: `${completedCount}/${sessions.length}`, result: (completedCount/sessions.length) * 100, icon: <Target size={26} /> },
  { id: 4, title: "Completion Rate", value: `${completionPercentage}%`, result: completionPercentage, icon: <TrendingUp size={26} />, charging: true },
];


  return (
    <div className="bg-gray-100 dark:bg-card rounded-3xl p-5 flex justify-between items-center w-full max-w-6xl mx-auto shadow-lg">
      {stats.map((stat) => {
        const color =
          stat.result > 60
            ? "#22c55e" // green
            : stat.result > 20
            ? "#facc15" // yellow
            : "#ef4444"; // red

        return (
          <div
            key={stat.id}
            className="flex flex-col items-center justify-center gap-2 w-1/4"
          >
            <div className="relative">
              <StatsRing percentage={stat.result} color={color} />
              <div className="absolute inset-0 flex items-center justify-center dark:text-white text-gray-900">
                {stat.icon}
              </div>
            </div>

            <p className="dark:text-white text-gray-900 text-lg font-semibold mt-1">
              {stat.value}
            </p>

            {/* Name + optional charging icon */}
            <div className="flex items-center gap-1">
             
              <p className="dark:text-gray-300 text-gray-600 text-xs text-center leading-tight">
                {stat.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCard;
