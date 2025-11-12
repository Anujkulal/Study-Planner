import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Calendar, Sparkles, Loader2 } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { addSession } from '@/redux/slices/sessionSlice';
import { toast } from 'sonner';

export const AIScheduleGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<any>(null);
  const [preferences, setPreferences] = useState({
    studyGoalHours: 10,
    preferredTimes: ['morning', 'afternoon'],
    subjects: [''],
  });

  const { sessions } = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch<AppDispatch>();

  if(!sessions){
    return;
  }

  const generateSchedule = async () => {
    setLoading(true);
    try {
      const result = await aiService.generateStudySchedule(sessions, preferences);
      setGeneratedSchedule(result);
      toast.success('AI schedule generated!');
    } catch (error) {
      console.error('Failed to generate schedule:', error);
      toast.error('Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  const applySchedule = async () => {
    if (!generatedSchedule?.schedule) return;

    try {
      for (const session of generatedSchedule.schedule) {
        await dispatch(addSession({
          subject: session.subject,
          duration: session.duration,
          day: session.day,
          notes: `AI Generated: ${session.reason}\nStart Time: ${session.startTime}`,
          status: 'pending',
        })).unwrap();
      }
      toast.success('Schedule applied successfully!');
      setGeneratedSchedule(null);
    } catch (error) {
      toast.error('Failed to apply schedule');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Schedule Generator
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className='flex gap-2 flex-col'>
            <Label htmlFor="goal-hours">Weekly Study Goal (hours)</Label>
            <Input
              id="goal-hours"
              type="number"
              value={preferences.studyGoalHours}
              onChange={(e) => setPreferences({
                ...preferences,
                studyGoalHours: parseInt(e.target.value) || 0
              })}
              min="1"
              max="100"
            />
          </div>

          <div className='flex gap-2 flex-col'>
            <Label>Subjects to Focus On</Label>
            <Input
              placeholder="Mathematics, Physics, Chemistry (comma-separated)"
              value={preferences.subjects.join(', ')}
              onChange={(e) => setPreferences({
                ...preferences,
                subjects: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
            />
          </div>

          <Button 
            onClick={generateSchedule} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Schedule
              </>
            )}
          </Button>
        </div>

        {generatedSchedule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mt-6 p-4 bg-muted rounded-lg"
          >
            <h3 className="font-semibold">Generated Schedule</h3>
            
            <div className="space-y-2">
              {generatedSchedule.schedule?.map((session: any, idx: number) => (
                <div key={idx} className="p-3 bg-background rounded border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{session.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.day).toLocaleDateString()} at {session.startTime}
                      </p>
                    </div>
                    <Badge>{session.duration} mins</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    {session.reason}
                  </p>
                </div>
              ))}
            </div>

            {generatedSchedule.insights && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                <p className="text-sm">{generatedSchedule.insights}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={applySchedule} className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Apply to Calendar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setGeneratedSchedule(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};